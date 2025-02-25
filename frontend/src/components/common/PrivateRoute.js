import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const PrivateRoute = ({ children }) => {
  const { currentUser, isLoading, isInitialized } = useSelector(state => state.auth);
  const location = useLocation();

  // Si aún se está cargando o no se ha inicializado, mostrar loader
  if (isLoading || !isInitialized) {
    return <Loader />;
  }

  // Si no hay usuario autenticado, redirigir al login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay usuario autenticado, mostrar el contenido protegido
  return children;
};

export default PrivateRoute; 