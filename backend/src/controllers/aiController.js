const admin = require('firebase-admin');
const tf = require('@tensorflow/tfjs-node');

// Variable para almacenar los modelos entrenados
let workoutModel = null;
let nutritionModel = null;

// Inicializar y cargar los modelos (en una app real, estos modelos estarían pre-entrenados y guardados)
const initModels = async () => {
  try {
    // Modelo simple para demostración
    workoutModel = tf.sequential();
    workoutModel.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }));
    workoutModel.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    workoutModel.add(tf.layers.dense({ units: 5, activation: 'softmax' }));
    
    workoutModel.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
    
    nutritionModel = tf.sequential();
    nutritionModel.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [8] }));
    nutritionModel.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    nutritionModel.add(tf.layers.dense({ units: 3 }));
    
    nutritionModel.compile({
      optimizer: 'rmsprop',
      loss: 'meanSquaredError'
    });
    
    console.log('Modelos de IA inicializados correctamente');
  } catch (error) {
    console.error('Error al inicializar modelos de IA:', error);
  }
};

// Llamar a la inicialización (en un caso real, esto se haría al iniciar la aplicación)
initModels();

// Generar plan de entrenamiento personalizado
const generateWorkoutPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      weight, 
      height, 
      age, 
      gender, 
      fitnessLevel, 
      goals, 
      daysPerWeek, 
      preferredExercises,
      healthIssues 
    } = req.body;
    
    // Obtener datos del usuario desde Firestore
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const userData = userDoc.data();
    
    // Combinar datos del request con datos del perfil
    const userWeight = weight || userData.weight;
    const userHeight = height || userData.height;
    const userAge = age || userData.age;
    const userGender = gender || userData.gender;
    
    if (!userWeight || !userHeight || !userAge || !userGender) {
      return res.status(400).json({ 
        message: 'Por favor, complete su perfil con información básica (peso, altura, edad, género)'
      });
    }
    
    // Verificar otros campos requeridos
    if (!fitnessLevel || !goals || !daysPerWeek) {
      return res.status(400).json({ 
        message: 'Por favor, proporcione nivel de condición física, objetivos y días por semana'
      });
    }
    
    // En una app real, aquí se usaría el modelo de IA para generar un plan personalizado
    // Este es un ejemplo simulado
    
    // Mapeo de niveles de condición física
    const fitnessLevelMap = {
      beginner: 1,
      intermediate: 2,
      advanced: 3
    };
    
    // Mapeo de objetivos
    const goalsMap = {
      'weight-loss': [1, 0, 0, 0, 0],
      'muscle-gain': [0, 1, 0, 0, 0],
      'endurance': [0, 0, 1, 0, 0],
      'strength': [0, 0, 0, 1, 0],
      'flexibility': [0, 0, 0, 0, 1]
    };
    
    // Crear entrada para el modelo (en una app real)
    /*
    const input = tf.tensor2d([[
      userWeight / 100, // Normalizar peso
      userHeight / 200, // Normalizar altura
      userAge / 100, // Normalizar edad
      userGender === 'male' ? 1 : 0,
      fitnessLevelMap[fitnessLevel] / 3, // Normalizar nivel
      daysPerWeek / 7, // Normalizar días por semana
      ...goalsMap[goals[0]] // One-hot encoding del objetivo principal
    ]]);
    
    // Hacer predicción con el modelo
    const prediction = await workoutModel.predict(input).array();
    */
    
    // Simulación de planes de entrenamiento
    const workoutPlans = {
      beginner: {
        'weight-loss': {
          name: 'Plan de pérdida de peso para principiantes',
          description: 'Un plan suave para comenzar a perder peso de forma gradual y segura',
          weeks: 4,
          sessions: [
            {
              day: 1,
              exercises: [
                { name: 'Caminata rápida', duration: 30, sets: null, reps: null },
                { name: 'Sentadillas con peso corporal', duration: null, sets: 3, reps: 10 },
                { name: 'Plancha', duration: null, sets: 3, reps: '30 segundos' },
                { name: 'Elevaciones de rodillas', duration: null, sets: 3, reps: 15 }
              ]
            },
            {
              day: 3,
              exercises: [
                { name: 'Natación suave', duration: 20, sets: null, reps: null },
                { name: 'Estocadas', duration: null, sets: 3, reps: 10 },
                { name: 'Elevaciones laterales', duration: null, sets: 3, reps: 12 },
                { name: 'Bird-dog', duration: null, sets: 3, reps: 10 }
              ]
            },
            {
              day: 5,
              exercises: [
                { name: 'Yoga básico', duration: 30, sets: null, reps: null },
                { name: 'Puentes de glúteos', duration: null, sets: 3, reps: 15 },
                { name: 'Flexiones modificadas', duration: null, sets: 3, reps: 8 },
                { name: 'Crunch abdominal', duration: null, sets: 3, reps: 12 }
              ]
            }
          ]
        },
        'muscle-gain': {
          name: 'Plan de ganancia muscular para principiantes',
          description: 'Introduce el entrenamiento de fuerza de forma segura para principiantes',
          weeks: 4,
          sessions: [
            {
              day: 1,
              exercises: [
                { name: 'Sentadillas con peso corporal', duration: null, sets: 4, reps: 12 },
                { name: 'Flexiones modificadas', duration: null, sets: 3, reps: 10 },
                { name: 'Puentes de glúteos', duration: null, sets: 3, reps: 15 },
                { name: 'Plancha', duration: null, sets: 3, reps: '45 segundos' }
              ]
            },
            {
              day: 3,
              exercises: [
                { name: 'Estocadas', duration: null, sets: 3, reps: 12 },
                { name: 'Remo con banda elástica', duration: null, sets: 3, reps: 12 },
                { name: 'Elevaciones laterales', duration: null, sets: 3, reps: 15 },
                { name: 'Superman', duration: null, sets: 3, reps: 12 }
              ]
            },
            {
              day: 5,
              exercises: [
                { name: 'Curl de bíceps con banda', duration: null, sets: 3, reps: 12 },
                { name: 'Extensión de tríceps', duration: null, sets: 3, reps: 12 },
                { name: 'Elevaciones de talones', duration: null, sets: 3, reps: 20 },
                { name: 'Abdominales', duration: null, sets: 3, reps: 15 }
              ]
            }
          ]
        }
      },
      intermediate: {
        'weight-loss': {
          name: 'Plan de pérdida de peso intermedio',
          description: 'Combinación de cardio y entrenamiento de fuerza para maximizar la quema de grasa',
          weeks: 6,
          sessions: [
            {
              day: 1,
              exercises: [
                { name: 'HIIT (carrera/caminata)', duration: 20, sets: null, reps: null },
                { name: 'Sentadillas con salto', duration: null, sets: 4, reps: 15 },
                { name: 'Burpees', duration: null, sets: 3, reps: 12 },
                { name: 'Mountain climbers', duration: null, sets: 3, reps: '45 segundos' }
              ]
            },
            {
              day: 2,
              exercises: [
                { name: 'Entrenamiento con pesas - parte superior', duration: 45, sets: null, reps: null }
              ]
            },
            {
              day: 3,
              exercises: [
                { name: 'Spinning o ciclismo', duration: 30, sets: null, reps: null }
              ]
            },
            {
              day: 5,
              exercises: [
                { name: 'Entrenamiento con pesas - parte inferior', duration: 45, sets: null, reps: null }
              ]
            },
            {
              day: 6,
              exercises: [
                { name: 'Circuito metabólico', duration: 30, sets: null, reps: null }
              ]
            }
          ]
        }
      }
    };
    
    // Seleccionar el plan adecuado basado en los parámetros
    const goalType = goals[0] || 'weight-loss';
    const plan = workoutPlans[fitnessLevel]?.[goalType] || workoutPlans.beginner['weight-loss'];
    
    // Ajustar el plan según días disponibles
    const adjustedSessions = plan.sessions.slice(0, Math.min(daysPerWeek, plan.sessions.length));
    
    // Guardar el plan para el usuario
    const workoutPlanData = {
      userId,
      name: plan.name,
      description: plan.description,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      weeks: plan.weeks,
      sessions: adjustedSessions,
      preferences: {
        fitnessLevel,
        goals,
        daysPerWeek,
        preferredExercises: preferredExercises || [],
        healthIssues: healthIssues || []
      }
    };
    
    const planRef = await admin.firestore().collection('workoutPlans').add(workoutPlanData);
    
    res.status(201).json({
      id: planRef.id,
      ...workoutPlanData
    });
  } catch (error) {
    console.error('Error al generar plan de entrenamiento:', error);
    res.status(500).json({ message: 'Error al generar plan de entrenamiento', error: error.message });
  }
};

// Generar plan de alimentación personalizado
const generateMealPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      weight, 
      height, 
      age, 
      gender, 
      activityLevel, 
      goals, 
      dietaryPreferences,
      allergies,
      mealsPerDay 
    } = req.body;
    
    // Obtener datos del usuario desde Firestore
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const userData = userDoc.data();
    
    // Combinar datos del request con datos del perfil
    const userWeight = weight || userData.weight;
    const userHeight = height || userData.height;
    const userAge = age || userData.age;
    const userGender = gender || userData.gender;
    
    if (!userWeight || !userHeight || !userAge || !userGender) {
      return res.status(400).json({ 
        message: 'Por favor, complete su perfil con información básica (peso, altura, edad, género)'
      });
    }
    
    // Verificar otros campos requeridos
    if (!activityLevel || !goals || !mealsPerDay) {
      return res.status(400).json({ 
        message: 'Por favor, proporcione nivel de actividad, objetivos y número de comidas por día'
      });
    }
    
    // Calcular BMR (Basal Metabolic Rate) usando la fórmula de Harris-Benedict
    let bmr;
    if (userGender === 'male') {
      bmr = 88.362 + (13.397 * userWeight) + (4.799 * userHeight) - (5.677 * userAge);
    } else {
      bmr = 447.593 + (9.247 * userWeight) + (3.098 * userHeight) - (4.330 * userAge);
    }
    
    // Factor de actividad
    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    
    // Calorías diarias totales
    const tdee = bmr * activityFactors[activityLevel];
    
    // Ajustar según el objetivo
    let targetCalories;
    const mainGoal = goals[0] || 'maintain';
    
    switch (mainGoal) {
      case 'weight-loss':
        targetCalories = tdee - 500; // Déficit para pérdida de peso
        break;
      case 'muscle-gain':
        targetCalories = tdee + 300; // Superávit para ganancia muscular
        break;
      default:
        targetCalories = tdee; // Mantenimiento
    }
    
    // Distribución de macronutrientes basada en el objetivo
    let proteinRatio, carbRatio, fatRatio;
    
    switch (mainGoal) {
      case 'weight-loss':
        proteinRatio = 0.40; // 40% proteínas
        carbRatio = 0.30;    // 30% carbohidratos
        fatRatio = 0.30;     // 30% grasas
        break;
      case 'muscle-gain':
        proteinRatio = 0.30; // 30% proteínas
        carbRatio = 0.45;    // 45% carbohidratos
        fatRatio = 0.25;     // 25% grasas
        break;
      default:
        proteinRatio = 0.30; // 30% proteínas
        carbRatio = 0.40;    // 40% carbohidratos
        fatRatio = 0.30;     // 30% grasas
    }
    
    // Cálculo de macronutrientes en gramos
    const proteinCalories = targetCalories * proteinRatio;
    const carbCalories = targetCalories * carbRatio;
    const fatCalories = targetCalories * fatRatio;
    
    const proteinGrams = Math.round(proteinCalories / 4); // 4 cal/g
    const carbGrams = Math.round(carbCalories / 4);       // 4 cal/g
    const fatGrams = Math.round(fatCalories / 9);         // 9 cal/g
    
    // Distribución de calorías por comida
    const mealDistribution = {
      3: [0.30, 0.40, 0.30], // Desayuno 30%, Almuerzo 40%, Cena 30%
      4: [0.25, 0.35, 0.25, 0.15], // Desayuno, Almuerzo, Cena, Merienda
      5: [0.20, 0.10, 0.35, 0.10, 0.25], // Desayuno, Snack, Almuerzo, Snack, Cena
      6: [0.20, 0.10, 0.30, 0.10, 0.20, 0.10] // Desayuno, Snack, Almuerzo, Snack, Cena, Snack
    };
    
    const distribution = mealDistribution[mealsPerDay] || mealDistribution[3];
    
    // Generar calorías para cada comida
    const meals = distribution.map((ratio, index) => {
      const mealCalories = Math.round(targetCalories * ratio);
      const mealProtein = Math.round(proteinGrams * ratio);
      const mealCarbs = Math.round(carbGrams * ratio);
      const mealFat = Math.round(fatGrams * ratio);
      
      let mealName;
      switch (index) {
        case 0: 
          mealName = 'Desayuno';
          break;
        case 1: 
          mealName = mealsPerDay <= 3 ? 'Almuerzo' : 'Snack de mañana';
          break;
        case 2:
          mealName = mealsPerDay <= 3 ? 'Cena' : 'Almuerzo';
          break;
        case 3:
          mealName = mealsPerDay === 4 ? 'Merienda' : 'Snack de tarde';
          break;
        case 4:
          mealName = 'Cena';
          break;
        case 5:
          mealName = 'Snack nocturno';
          break;
        default:
          mealName = `Comida ${index + 1}`;
      }
      
      return {
        name: mealName,
        calories: mealCalories,
        protein: mealProtein,
        carbs: mealCarbs,
        fat: mealFat
      };
    });
    
    // Guardar el plan de alimentación
    const mealPlanData = {
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      targetCalories: Math.round(targetCalories),
      macros: {
        protein: proteinGrams,
        carbs: carbGrams,
        fat: fatGrams
      },
      meals,
      preferences: {
        activityLevel,
        goals,
        dietaryPreferences: dietaryPreferences || [],
        allergies: allergies || [],
        mealsPerDay
      }
    };
    
    const planRef = await admin.firestore().collection('mealPlans').add(mealPlanData);
    
    res.status(201).json({
      id: planRef.id,
      ...mealPlanData
    });
  } catch (error) {
    console.error('Error al generar plan de alimentación:', error);
    res.status(500).json({ message: 'Error al generar plan de alimentación', error: error.message });
  }
};

// Analizar progreso del usuario
const analyzeProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'month' } = req.query;
    
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
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }
    
    // Obtener entrenamientos en el período
    const workoutsSnapshot = await admin.firestore()
      .collection('workouts')
      .where('userId', '==', userId)
      .where('date', '>=', startDate)
      .where('date', '<=', now)
      .orderBy('date', 'asc')
      .get();
    
    // Obtener comidas en el período
    const mealsSnapshot = await admin.firestore()
      .collection('meals')
      .where('userId', '==', userId)
      .where('date', '>=', startDate)
      .where('date', '<=', now)
      .orderBy('date', 'asc')
      .get();
    
    // Obtener medidas del usuario (peso)
    const weightsSnapshot = await admin.firestore()
      .collection('userMeasurements')
      .where('userId', '==', userId)
      .where('date', '>=', startDate)
      .where('date', '<=', now)
      .orderBy('date', 'asc')
      .get();
    
    // Procesar datos de entrenamiento
    const workoutData = [];
    const workoutsByType = {};
    let totalWorkouts = 0;
    let totalDuration = 0;
    let totalCaloriesBurned = 0;
    
    workoutsSnapshot.forEach(doc => {
      const workout = doc.data();
      totalWorkouts++;
      totalDuration += workout.duration || 0;
      totalCaloriesBurned += workout.caloriesBurned || 0;
      
      // Agregar al array cronológico
      workoutData.push({
        date: workout.date.toDate(),
        type: workout.type,
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurned
      });
      
      // Contar por tipo
      const type = workout.type || 'Otro';
      if (!workoutsByType[type]) {
        workoutsByType[type] = {
          count: 0,
          duration: 0,
          caloriesBurned: 0
        };
      }
      
      workoutsByType[type].count++;
      workoutsByType[type].duration += workout.duration || 0;
      workoutsByType[type].caloriesBurned += workout.caloriesBurned || 0;
    });
    
    // Procesar datos de nutrición
    const nutritionData = [];
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    mealsSnapshot.forEach(doc => {
      const meal = doc.data();
      totalCalories += meal.calories || 0;
      totalProtein += meal.protein || 0;
      totalCarbs += meal.carbs || 0;
      totalFat += meal.fat || 0;
      
      // Agregar al array cronológico
      nutritionData.push({
        date: meal.date.toDate(),
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat
      });
    });
    
    // Procesar datos de peso
    const weightData = [];
    let initialWeight = null;
    let latestWeight = null;
    
    weightsSnapshot.forEach(doc => {
      const measurement = doc.data();
      
      // Agregar al array cronológico
      weightData.push({
        date: measurement.date.toDate(),
        weight: measurement.weight
      });
      
      // Guardar peso inicial y final
      if (initialWeight === null) {
        initialWeight = measurement.weight;
      }
      
      latestWeight = measurement.weight;
    });
    
    // Calcular cambio de peso
    const weightChange = latestWeight !== null && initialWeight !== null ? 
      latestWeight - initialWeight : null;
    
    // Calcular promedios diarios
    const daysDifference = Math.max(1, Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)));
    
    const averageCaloriesPerDay = totalCalories / daysDifference;
    const averageProteinPerDay = totalProtein / daysDifference;
    const averageCarbsPerDay = totalCarbs / daysDifference;
    const averageFatPerDay = totalFat / daysDifference;
    
    // Análisis y recomendaciones
    let analysis = [];
    let recommendations = [];
    
    // Análisis de entrenamientos
    if (totalWorkouts > 0) {
      analysis.push(`Has completado ${totalWorkouts} entrenamientos en el período seleccionado.`);
      
      if (totalWorkouts < daysDifference * 0.3) {
        recommendations.push('Considera aumentar la frecuencia de tus entrenamientos para mejores resultados.');
      } else if (totalWorkouts > daysDifference * 0.7) {
        analysis.push('¡Gran trabajo con la consistencia de tus entrenamientos!');
      }
      
      // Análisis por tipo de entrenamiento
      const workoutTypes = Object.keys(workoutsByType);
      if (workoutTypes.length === 1) {
        recommendations.push(`Estás enfocándote solo en entrenamientos de tipo ${workoutTypes[0]}. Considera diversificar para un entrenamiento más completo.`);
      } else if (workoutTypes.length > 1) {
        analysis.push(`Buena variedad de entrenamientos: ${workoutTypes.join(', ')}.`);
      }
    } else {
      recommendations.push('No se encontraron entrenamientos registrados. Comienza a registrar tus actividades para un mejor seguimiento.');
    }
    
    // Análisis de nutrición
    if (nutritionData.length > 0) {
      analysis.push(`Consumo calórico promedio: ${Math.round(averageCaloriesPerDay)} calorías por día.`);
      
      // Análisis de macronutrientes
      const proteinRatio = (averageProteinPerDay * 4) / averageCaloriesPerDay;
      const carbRatio = (averageCarbsPerDay * 4) / averageCaloriesPerDay;
      const fatRatio = (averageFatPerDay * 9) / averageCaloriesPerDay;
      
      if (proteinRatio < 0.15) {
        recommendations.push('Tu consumo de proteínas es bajo. Considera aumentarlo para mejor recuperación muscular.');
      } else if (proteinRatio > 0.35) {
        analysis.push('Tu consumo de proteínas es alto, lo cual es bueno para la recuperación muscular.');
      }
      
      if (carbRatio < 0.20) {
        analysis.push('Estás siguiendo una dieta baja en carbohidratos.');
      } else if (carbRatio > 0.60) {
        recommendations.push('Tu dieta es alta en carbohidratos. Considera equilibrarla con más proteínas y grasas saludables.');
      }
    } else {
      recommendations.push('No se encontraron registros de alimentación. Comienza a registrar tus comidas para un mejor seguimiento nutricional.');
    }
    
    // Análisis de peso
    if (weightChange !== null) {
      if (weightChange < 0) {
        analysis.push(`Has perdido ${Math.abs(weightChange)} kg en el período analizado.`);
      } else if (weightChange > 0) {
        analysis.push(`Has ganado ${weightChange} kg en el período analizado.`);
      } else {
        analysis.push('Tu peso se ha mantenido estable en el período analizado.');
      }
    }
    
    res.json({
      period,
      analysis,
      recommendations,
      workout: {
        total: totalWorkouts,
        totalDuration,
        totalCaloriesBurned,
        averagePerDay: totalWorkouts / daysDifference,
        byType: workoutsByType,
        timeline: workoutData
      },
      nutrition: {
        averageCaloriesPerDay: Math.round(averageCaloriesPerDay),
        averageProteinPerDay: Math.round(averageProteinPerDay),
        averageCarbsPerDay: Math.round(averageCarbsPerDay),
        averageFatPerDay: Math.round(averageFatPerDay),
        timeline: nutritionData
      },
      weight: {
        initial: initialWeight,
        latest: latestWeight,
        change: weightChange,
        timeline: weightData
      }
    });
  } catch (error) {
    console.error('Error al analizar progreso:', error);
    res.status(500).json({ message: 'Error al analizar progreso', error: error.message });
  }
};

// Predecir logros de fitness basados en datos históricos
const predictFitnessGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { goal, targetDate } = req.body;
    
    if (!goal || !targetDate) {
      return res.status(400).json({ message: 'Por favor, proporcione un objetivo y una fecha meta' });
    }
    
    // Validar fecha objetivo
    const today = new Date();
    const targetDateObj = new Date(targetDate);
    
    if (targetDateObj <= today) {
      return res.status(400).json({ message: 'La fecha meta debe ser en el futuro' });
    }
    
    // Calcular días restantes
    const daysUntilTarget = Math.ceil((targetDateObj - today) / (1000 * 60 * 60 * 24));
    
    // Obtener historial de entrenamientos y nutrición del usuario
    const workoutsSnapshot = await admin.firestore()
      .collection('workouts')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .limit(30) // Últimos 30 entrenamientos
      .get();
    
    const mealsSnapshot = await admin.firestore()
      .collection('meals')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .limit(30) // Últimas 30 comidas
      .get();
    
    const weightsSnapshot = await admin.firestore()
      .collection('userMeasurements')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .limit(10) // Últimas 10 mediciones
      .get();
    
    // Procesar datos para predecir
    const workouts = [];
    workoutsSnapshot.forEach(doc => {
      workouts.push(doc.data());
    });
    
    const meals = [];
    mealsSnapshot.forEach(doc => {
      meals.push(doc.data());
    });
    
    const weights = [];
    weightsSnapshot.forEach(doc => {
      weights.push(doc.data());
    });
    
    // En una app real, aquí se usaría el modelo de IA para generar predicciones
    // Este es un ejemplo simulado
    
    let prediction = null;
    let confidence = 0;
    let requiredActions = [];
    
    // Predicciones según el tipo de objetivo
    switch (goal) {
      case 'weight-loss': {
        // Calcular tendencia de pérdida de peso si hay suficientes datos
        if (weights.length >= 2) {
          const sortedWeights = weights.sort((a, b) => a.date.toDate() - b.date.toDate());
          const oldestWeight = sortedWeights[0].weight;
          const newestWeight = sortedWeights[sortedWeights.length - 1].weight;
          const weightDiff = oldestWeight - newestWeight;
          const daysBetweenMeasurements = Math.ceil(
            (sortedWeights[sortedWeights.length - 1].date.toDate() - sortedWeights[0].date.toDate()) / 
            (1000 * 60 * 60 * 24)
          );
          
          // Tasa de pérdida de peso (kg/día)
          const weightLossRate = daysBetweenMeasurements > 0 ? weightDiff / daysBetweenMeasurements : 0;
          
          // Proyectar pérdida de peso futura
          if (weightLossRate > 0) {
            const projectedLoss = weightLossRate * daysUntilTarget;
            prediction = Math.round((newestWeight - projectedLoss) * 10) / 10;
            confidence = Math.min(0.9, 0.4 + (weights.length * 0.05));
            
            if (weightLossRate < 0.1) {
              requiredActions.push('Aumentar el déficit calórico para acelerar la pérdida de peso');
              requiredActions.push('Incorporar más ejercicio cardiovascular');
            } else if (weightLossRate > 0.3) {
              requiredActions.push('Tu ritmo de pérdida de peso es rápido. Asegúrate de mantener una nutrición adecuada');
            }
          } else {
            prediction = newestWeight;
            confidence = 0.3;
            requiredActions.push('No se detecta pérdida de peso en tus registros recientes');
            requiredActions.push('Revisa tu ingesta calórica y crea un déficit para comenzar a perder peso');
          }
        } else {
          prediction = null;
          confidence = 0;
          requiredActions.push('No hay suficientes datos de peso para hacer una predicción precisa');
          requiredActions.push('Registra tu peso regularmente para obtener mejores predicciones');
        }
        break;
      }
      
      case 'muscle-gain': {
        // Analizar entrenamientos de fuerza
        const strengthWorkouts = workouts.filter(w => w.type === 'strength' || w.type === 'weightlifting');
        const workoutsPerWeek = workouts.length > 0 ? 
          (workouts.length / 4) : 0; // Asumir que los entrenamientos son de las últimas 4 semanas
        
        if (strengthWorkouts.length > 0) {
          // Cuanto más entrenamientos de fuerza, mayor probabilidad de ganancia muscular
          const strengthRatio = strengthWorkouts.length / workouts.length;
          
          // Analizar ingesta proteica
          const avgProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0) / Math.max(1, meals.length);
          
          // Proyectar ganancia muscular basada en entrenamiento y nutrición
          if (strengthRatio > 0.5 && avgProtein > 100 && workoutsPerWeek >= 3) {
            prediction = "Ganancia muscular significativa";
            confidence = 0.7;
            requiredActions.push('Mantén la consistencia en tus entrenamientos de fuerza');
          } else if (strengthRatio > 0.3 && avgProtein > 80 && workoutsPerWeek >= 2) {
            prediction = "Ganancia muscular moderada";
            confidence = 0.6;
            requiredActions.push('Aumenta la frecuencia de tus entrenamientos de fuerza');
            requiredActions.push('Considera incrementar tu ingesta de proteínas');
          } else {
            prediction = "Ganancia muscular leve";
            confidence = 0.4;
            requiredActions.push('Incrementa tus entrenamientos de fuerza a al menos 3 veces por semana');
            requiredActions.push('Asegúrate de consumir suficiente proteína (1.6-2g por kg de peso corporal)');
          }
        } else {
          prediction = "Progreso limitado";
          confidence = 0.3;
          requiredActions.push('No se detectaron entrenamientos de fuerza en tus registros');
          requiredActions.push('Incorpora entrenamiento con pesas para estimular el crecimiento muscular');
        }
        break;
      }
      
      case 'endurance': {
        // Analizar entrenamientos cardiovasculares
        const cardioWorkouts = workouts.filter(w => 
          w.type === 'cardio' || w.type === 'running' || w.type === 'cycling' || w.type === 'swimming'
        );
        
        if (cardioWorkouts.length > 0) {
          const avgDuration = cardioWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / cardioWorkouts.length;
          const workoutsPerWeek = cardioWorkouts.length > 0 ? 
            (cardioWorkouts.length / 4) : 0; // Asumir que son de las últimas 4 semanas
          
          if (avgDuration > 45 && workoutsPerWeek >= 4) {
            prediction = "Mejora significativa de resistencia";
            confidence = 0.8;
            requiredActions.push('Continúa con tu rutina actual, incorporando intervalos de alta intensidad');
          } else if (avgDuration > 30 && workoutsPerWeek >= 3) {
            prediction = "Mejora moderada de resistencia";
            confidence = 0.65;
            requiredActions.push('Incrementa gradualmente la duración de tus sesiones cardiovasculares');
          } else {
            prediction = "Mejora leve de resistencia";
            confidence = 0.5;
            requiredActions.push('Aumenta la frecuencia y duración de tus entrenamientos cardiovasculares');
          }
        } else {
          prediction = "Progreso limitado";
          confidence = 0.3;
          requiredActions.push('No se detectaron entrenamientos cardiovasculares en tus registros');
          requiredActions.push('Incorpora actividades como correr, nadar o ciclismo para mejorar tu resistencia');
        }
        break;
      }
      
      default:
        prediction = "No se pudo predecir para este tipo de objetivo";
        confidence = 0.1;
        requiredActions.push('Proporciona más información sobre tu objetivo específico');
    }
    
    // Guardar la predicción
    const predictionData = {
      userId,
      goal,
      targetDate: targetDateObj,
      prediction,
      confidence,
      requiredActions,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const predictionRef = await admin.firestore().collection('predictions').add(predictionData);
    
    res.json({
      id: predictionRef.id,
      ...predictionData,
      daysUntilTarget
    });
  } catch (error) {
    console.error('Error al predecir logros de fitness:', error);
    res.status(500).json({ message: 'Error al predecir logros', error: error.message });
  }
};

module.exports = {
  generateWorkoutPlan,
  generateMealPlan,
  analyzeProgress,
  predictFitnessGoals
}; 