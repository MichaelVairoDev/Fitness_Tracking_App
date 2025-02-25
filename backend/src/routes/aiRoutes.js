const express = require('express');
const router = express.Router();
const { 
  generateWorkoutPlan,
  generateMealPlan,
  analyzeProgress,
  predictFitnessGoals
} = require('../controllers/aiController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.post('/workout-plan', generateWorkoutPlan);
router.post('/meal-plan', generateMealPlan);
router.get('/analyze-progress', analyzeProgress);
router.post('/predict-goals', predictFitnessGoals);

module.exports = router; 