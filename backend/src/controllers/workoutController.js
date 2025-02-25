const admin = require('firebase-admin');

// Crear un nuevo entrenamiento
const createWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      title, 
      type, 
      duration, 
      caloriesBurned, 
      exercises, 
      notes, 
      date 
    } = req.body;

    if (!title || !type || !duration) {
      return res.status(400).json({ message: 'Por favor, proporcione los campos requeridos' });
    }

    const workoutData = {
      userId,
      title,
      type,
      duration,
      caloriesBurned: caloriesBurned || 0,
      exercises: exercises || [],
      notes: notes || '',
      date: date ? new Date(date) : admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const workoutRef = await admin.firestore().collection('workouts').add(workoutData);
    
    res.status(201).json({
      id: workoutRef.id,
      ...workoutData
    });
  } catch (error) {
    console.error('Error al crear entrenamiento:', error);
    res.status(500).json({ message: 'Error al crear entrenamiento', error: error.message });
  }
};

// Obtener todos los entrenamientos del usuario
const getWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, type, limit = 10, page = 1 } = req.query;
    
    let query = admin.firestore().collection('workouts').where('userId', '==', userId);
    
    // Filtrar por fecha
    if (startDate) {
      query = query.where('date', '>=', new Date(startDate));
    }
    
    if (endDate) {
      query = query.where('date', '<=', new Date(endDate));
    }
    
    // Filtrar por tipo
    if (type) {
      query = query.where('type', '==', type);
    }
    
    // Ordenar por fecha descendente
    query = query.orderBy('date', 'desc');
    
    // Paginación
    const skip = (page - 1) * parseInt(limit);
    const snapshot = await query.get();
    
    const workouts = [];
    let count = 0;
    
    snapshot.forEach(doc => {
      if (count >= skip && workouts.length < parseInt(limit)) {
        workouts.push({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date ? doc.data().date.toDate() : null,
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null
        });
      }
      count++;
    });
    
    res.json({
      workouts,
      page: parseInt(page),
      limit: parseInt(limit),
      total: snapshot.size,
      totalPages: Math.ceil(snapshot.size / parseInt(limit))
    });
  } catch (error) {
    console.error('Error al obtener entrenamientos:', error);
    res.status(500).json({ message: 'Error al obtener entrenamientos', error: error.message });
  }
};

// Obtener un entrenamiento por ID
const getWorkoutById = async (req, res) => {
  try {
    const userId = req.user.id;
    const workoutId = req.params.id;
    
    const workoutDoc = await admin.firestore().collection('workouts').doc(workoutId).get();
    
    if (!workoutDoc.exists) {
      return res.status(404).json({ message: 'Entrenamiento no encontrado' });
    }
    
    const workoutData = workoutDoc.data();
    
    // Verificar que el entrenamiento pertenece al usuario
    if (workoutData.userId !== userId) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    res.json({
      id: workoutDoc.id,
      ...workoutData,
      date: workoutData.date ? workoutData.date.toDate() : null,
      createdAt: workoutData.createdAt ? workoutData.createdAt.toDate() : null
    });
  } catch (error) {
    console.error('Error al obtener entrenamiento:', error);
    res.status(500).json({ message: 'Error al obtener entrenamiento', error: error.message });
  }
};

// Actualizar un entrenamiento
const updateWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const workoutId = req.params.id;
    const { 
      title, 
      type, 
      duration, 
      caloriesBurned, 
      exercises, 
      notes, 
      date 
    } = req.body;
    
    // Verificar que el entrenamiento existe y pertenece al usuario
    const workoutDoc = await admin.firestore().collection('workouts').doc(workoutId).get();
    
    if (!workoutDoc.exists) {
      return res.status(404).json({ message: 'Entrenamiento no encontrado' });
    }
    
    if (workoutDoc.data().userId !== userId) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    // Actualizar los campos
    const updateData = {
      ...(title && { title }),
      ...(type && { type }),
      ...(duration && { duration }),
      ...(caloriesBurned !== undefined && { caloriesBurned }),
      ...(exercises && { exercises }),
      ...(notes !== undefined && { notes }),
      ...(date && { date: new Date(date) }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await admin.firestore().collection('workouts').doc(workoutId).update(updateData);
    
    res.json({ message: 'Entrenamiento actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar entrenamiento:', error);
    res.status(500).json({ message: 'Error al actualizar entrenamiento', error: error.message });
  }
};

// Eliminar un entrenamiento
const deleteWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const workoutId = req.params.id;
    
    // Verificar que el entrenamiento existe y pertenece al usuario
    const workoutDoc = await admin.firestore().collection('workouts').doc(workoutId).get();
    
    if (!workoutDoc.exists) {
      return res.status(404).json({ message: 'Entrenamiento no encontrado' });
    }
    
    if (workoutDoc.data().userId !== userId) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    // Eliminar el entrenamiento
    await admin.firestore().collection('workouts').doc(workoutId).delete();
    
    res.json({ message: 'Entrenamiento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar entrenamiento:', error);
    res.status(500).json({ message: 'Error al eliminar entrenamiento', error: error.message });
  }
};

// Obtener estadísticas de entrenamientos
const getWorkoutStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'week' } = req.query;
    
    // Calcular fecha de inicio según el período
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    }
    
    // Obtener entrenamientos en el período
    const snapshot = await admin.firestore()
      .collection('workouts')
      .where('userId', '==', userId)
      .where('date', '>=', startDate)
      .where('date', '<=', now)
      .get();
    
    // Calcular estadísticas
    let totalWorkouts = 0;
    let totalDuration = 0;
    let totalCaloriesBurned = 0;
    const workoutsByType = {};
    const workoutsByDay = {};
    
    snapshot.forEach(doc => {
      const workout = doc.data();
      totalWorkouts++;
      totalDuration += workout.duration || 0;
      totalCaloriesBurned += workout.caloriesBurned || 0;
      
      // Contar por tipo
      const type = workout.type || 'Otro';
      workoutsByType[type] = (workoutsByType[type] || 0) + 1;
      
      // Agrupar por día
      const dateStr = workout.date ? workout.date.toDate().toISOString().split('T')[0] : 'unknown';
      if (!workoutsByDay[dateStr]) {
        workoutsByDay[dateStr] = {
          count: 0,
          duration: 0,
          caloriesBurned: 0
        };
      }
      
      workoutsByDay[dateStr].count++;
      workoutsByDay[dateStr].duration += workout.duration || 0;
      workoutsByDay[dateStr].caloriesBurned += workout.caloriesBurned || 0;
    });
    
    res.json({
      totalWorkouts,
      totalDuration,
      totalCaloriesBurned,
      averageDuration: totalWorkouts > 0 ? totalDuration / totalWorkouts : 0,
      averageCaloriesBurned: totalWorkouts > 0 ? totalCaloriesBurned / totalWorkouts : 0,
      workoutsByType,
      workoutsByDay,
      period
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats
}; 