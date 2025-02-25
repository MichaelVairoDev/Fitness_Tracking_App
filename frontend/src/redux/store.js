import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import workoutReducer from './workout/workoutSlice';
import nutritionReducer from './nutrition/nutritionSlice';
import aiReducer from './ai/aiSlice';
import uiReducer from './ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workout: workoutReducer,
    nutrition: nutritionReducer,
    ai: aiReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
}); 