const express = require('express');
const router = express.Router();
const { 
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats
} = require('../controllers/workoutController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.post('/', createWorkout);
router.get('/', getWorkouts);
router.get('/stats', getWorkoutStats);
router.get('/:id', getWorkoutById);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

module.exports = router; 