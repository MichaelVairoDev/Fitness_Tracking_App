const admin = require('firebase-admin');

// Agregar una comida
const addMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name, 
      type, 
      calories, 
      protein, 
      carbs, 
      fat, 
      foods, 
      notes, 
      date 
    } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Por favor, proporcione los campos requeridos' });
    }

    const mealData = {
      userId,
      name,
      type,
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      foods: foods || [],
      notes: notes || '',
      date: date ? new Date(date) : admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const mealRef = await admin.firestore().collection('meals').add(mealData);
    
    res.status(201).json({
      id: mealRef.id,
      ...mealData
    });
  } catch (error) {
    console.error('Error al agregar comida:', error);
    res.status(500).json({ message: 'Error al agregar comida', error: error.message });
  }
};

// Obtener todas las comidas del usuario
const getMeals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, type, limit = 10, page = 1 } = req.query;
    
    let query = admin.firestore().collection('meals').where('userId', '==', userId);
    
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
    
    const meals = [];
    let count = 0;
    
    snapshot.forEach(doc => {
      if (count >= skip && meals.length < parseInt(limit)) {
        meals.push({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date ? doc.data().date.toDate() : null,
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null
        });
      }
      count++;
    });
    
    res.json({
      meals,
      page: parseInt(page),
      limit: parseInt(limit),
      total: snapshot.size,
      totalPages: Math.ceil(snapshot.size / parseInt(limit))
    });
  } catch (error) {
    console.error('Error al obtener comidas:', error);
    res.status(500).json({ message: 'Error al obtener comidas', error: error.message });
  }
};

// Obtener una comida por ID
const getMealById = async (req, res) => {
  try {
    const userId = req.user.id;
    const mealId = req.params.id;
    
    const mealDoc = await admin.firestore().collection('meals').doc(mealId).get();
    
    if (!mealDoc.exists) {
      return res.status(404).json({ message: 'Comida no encontrada' });
    }
    
    const mealData = mealDoc.data();
    
    // Verificar que la comida pertenece al usuario
    if (mealData.userId !== userId) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    res.json({
      id: mealDoc.id,
      ...mealData,
      date: mealData.date ? mealData.date.toDate() : null,
      createdAt: mealData.createdAt ? mealData.createdAt.toDate() : null
    });
  } catch (error) {
    console.error('Error al obtener comida:', error);
    res.status(500).json({ message: 'Error al obtener comida', error: error.message });
  }
};

// Actualizar una comida
const updateMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const mealId = req.params.id;
    const { 
      name, 
      type, 
      calories, 
      protein, 
      carbs, 
      fat, 
      foods, 
      notes, 
      date 
    } = req.body;
    
    // Verificar que la comida existe y pertenece al usuario
    const mealDoc = await admin.firestore().collection('meals').doc(mealId).get();
    
    if (!mealDoc.exists) {
      return res.status(404).json({ message: 'Comida no encontrada' });
    }
    
    if (mealDoc.data().userId !== userId) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    // Actualizar los campos
    const updateData = {
      ...(name && { name }),
      ...(type && { type }),
      ...(calories !== undefined && { calories }),
      ...(protein !== undefined && { protein }),
      ...(carbs !== undefined && { carbs }),
      ...(fat !== undefined && { fat }),
      ...(foods && { foods }),
      ...(notes !== undefined && { notes }),
      ...(date && { date: new Date(date) }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await admin.firestore().collection('meals').doc(mealId).update(updateData);
    
    res.json({ message: 'Comida actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar comida:', error);
    res.status(500).json({ message: 'Error al actualizar comida', error: error.message });
  }
};

// Eliminar una comida
const deleteMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const mealId = req.params.id;
    
    // Verificar que la comida existe y pertenece al usuario
    const mealDoc = await admin.firestore().collection('meals').doc(mealId).get();
    
    if (!mealDoc.exists) {
      return res.status(404).json({ message: 'Comida no encontrada' });
    }
    
    if (mealDoc.data().userId !== userId) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    // Eliminar la comida
    await admin.firestore().collection('meals').doc(mealId).delete();
    
    res.json({ message: 'Comida eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar comida:', error);
    res.status(500).json({ message: 'Error al eliminar comida', error: error.message });
  }
};

// Obtener estadísticas de nutrición
const getNutritionStats = async (req, res) => {
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
    
    // Obtener comidas en el período
    const snapshot = await admin.firestore()
      .collection('meals')
      .where('userId', '==', userId)
      .where('date', '>=', startDate)
      .where('date', '<=', now)
      .get();
    
    // Calcular estadísticas
    let totalMeals = 0;
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    const mealsByType = {};
    const nutritionByDay = {};
    
    snapshot.forEach(doc => {
      const meal = doc.data();
      totalMeals++;
      totalCalories += meal.calories || 0;
      totalProtein += meal.protein || 0;
      totalCarbs += meal.carbs || 0;
      totalFat += meal.fat || 0;
      
      // Contar por tipo
      const type = meal.type || 'Otro';
      mealsByType[type] = (mealsByType[type] || 0) + 1;
      
      // Agrupar por día
      const dateStr = meal.date ? meal.date.toDate().toISOString().split('T')[0] : 'unknown';
      if (!nutritionByDay[dateStr]) {
        nutritionByDay[dateStr] = {
          meals: 0,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        };
      }
      
      nutritionByDay[dateStr].meals++;
      nutritionByDay[dateStr].calories += meal.calories || 0;
      nutritionByDay[dateStr].protein += meal.protein || 0;
      nutritionByDay[dateStr].carbs += meal.carbs || 0;
      nutritionByDay[dateStr].fat += meal.fat || 0;
    });
    
    res.json({
      totalMeals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      averageCaloriesPerDay: Object.keys(nutritionByDay).length > 0 ? totalCalories / Object.keys(nutritionByDay).length : 0,
      mealsByType,
      nutritionByDay,
      period
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de nutrición:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

// Buscar alimentos (simulado, en una app real se conectaría a una API de alimentos)
const searchFoods = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Por favor, proporcione un término de búsqueda' });
    }
    
    // Simulación de datos de alimentos
    const foods = [
      { id: 1, name: 'Manzana', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
      { id: 2, name: 'Plátano', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
      { id: 3, name: 'Pollo a la parrilla', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      { id: 4, name: 'Arroz blanco', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
      { id: 5, name: 'Huevo', calories: 68, protein: 5.5, carbs: 0.6, fat: 4.8 },
      { id: 6, name: 'Leche', calories: 42, protein: 3.4, carbs: 5, fat: 1 },
      { id: 7, name: 'Pan integral', calories: 81, protein: 4, carbs: 13.8, fat: 1.1 },
      { id: 8, name: 'Atún', calories: 116, protein: 25.5, carbs: 0, fat: 1 },
      { id: 9, name: 'Aguacate', calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
      { id: 10, name: 'Pasta', calories: 131, protein: 5, carbs: 25, fat: 1.1 }
    ];
    
    // Filtrar alimentos por nombre
    const filteredFoods = foods.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json(filteredFoods);
  } catch (error) {
    console.error('Error al buscar alimentos:', error);
    res.status(500).json({ message: 'Error al buscar alimentos', error: error.message });
  }
};

module.exports = {
  addMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getNutritionStats,
  searchFoods
}; 