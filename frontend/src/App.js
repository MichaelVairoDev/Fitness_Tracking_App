import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import Loader from './components/common/Loader';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import CreateWorkout from './pages/CreateWorkout';
import Nutrition from './pages/Nutrition';
import MealDetail from './pages/MealDetail';
import CreateMeal from './pages/CreateMeal';
import AiWorkoutPlan from './pages/AiWorkoutPlan';
import AiMealPlan from './pages/AiMealPlan';
import Progress from './pages/Progress';
import NotFound from './pages/NotFound';

// Acciones
import { checkUserSession } from './redux/auth/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isLoading, isInitialized, currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);

  if (!isInitialized) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route 
            path="/" 
            element={
              currentUser ? <Navigate to="/dashboard" replace /> : <Home />
            } 
          />
          <Route 
            path="/login" 
            element={
              currentUser ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          <Route 
            path="/register" 
            element={
              currentUser ? <Navigate to="/dashboard" replace /> : <Register />
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/workouts" 
            element={
              <PrivateRoute>
                <Workouts />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/workouts/:id" 
            element={
              <PrivateRoute>
                <WorkoutDetail />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/workouts/create" 
            element={
              <PrivateRoute>
                <CreateWorkout />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/nutrition" 
            element={
              <PrivateRoute>
                <Nutrition />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/nutrition/:id" 
            element={
              <PrivateRoute>
                <MealDetail />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/nutrition/create" 
            element={
              <PrivateRoute>
                <CreateMeal />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/ai/workout-plan" 
            element={
              <PrivateRoute>
                <AiWorkoutPlan />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/ai/meal-plan" 
            element={
              <PrivateRoute>
                <AiMealPlan />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/progress" 
            element={
              <PrivateRoute>
                <Progress />
              </PrivateRoute>
            } 
          />
          
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App; 