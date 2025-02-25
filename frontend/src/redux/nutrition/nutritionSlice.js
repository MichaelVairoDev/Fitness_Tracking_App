import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  meals: [],
  currentMeal: null,
  isLoading: false,
  error: null
};

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    setMeals: (state, action) => {
      state.meals = action.payload;
    },
    setCurrentMeal: (state, action) => {
      state.currentMeal = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setMeals, setCurrentMeal, setLoading, setError } = nutritionSlice.actions;

export default nutritionSlice.reducer; 