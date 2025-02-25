import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workoutPlan: null,
  mealPlan: null,
  isLoading: false,
  error: null
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setWorkoutPlan: (state, action) => {
      state.workoutPlan = action.payload;
    },
    setMealPlan: (state, action) => {
      state.mealPlan = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setWorkoutPlan, setMealPlan, setLoading, setError } = aiSlice.actions;

export default aiSlice.reducer; 