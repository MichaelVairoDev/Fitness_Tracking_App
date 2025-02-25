const express = require('express');
const router = express.Router();
const { 
  addMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getNutritionStats,
  searchFoods
} = require('../controllers/nutritionController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.post('/', addMeal);
router.get('/', getMeals);
router.get('/stats', getNutritionStats);
router.get('/search', searchFoods);
router.get('/:id', getMealById);
router.put('/:id', updateMeal);
router.delete('/:id', deleteMeal);

module.exports = router; 