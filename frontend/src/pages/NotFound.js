import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <h2>404 - Página No Encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Link to="/" className="btn btn-primary">
        Volver a Inicio
      </Link>
    </div>
  );
};

export default NotFound; 