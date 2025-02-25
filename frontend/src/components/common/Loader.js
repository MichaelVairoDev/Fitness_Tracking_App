import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', fullScreen = false }) => {
  const sizeClass = `spinner-${size}`;
  
  if (fullScreen) {
    return (
      <div className="loader-container fullscreen">
        <div className={`loading-spinner ${sizeClass}`}></div>
      </div>
    );
  }
  
  return (
    <div className="loader-container">
      <div className={`loading-spinner ${sizeClass}`}></div>
    </div>
  );
};

export default Loader; 