import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workouts: [],
  currentWorkout: null,
  isLoading: false,
  error: null
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setWorkouts: (state, action) => {
      state.workouts = action.payload;
    },
    setCurrentWorkout: (state, action) => {
      state.currentWorkout = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setWorkouts, setCurrentWorkout, setLoading, setError } = workoutSlice.actions;

export default workoutSlice.reducer; 