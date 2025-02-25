import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiGithub, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FitnessTrack</h3>
            <p>
              Tu aplicación de seguimiento de fitness con IA para ayudarte a alcanzar tus metas de salud y bienestar.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/workouts">Entrenamientos</Link></li>
              <li><Link to="/nutrition">Nutrición</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Planes IA</h4>
            <ul className="footer-links">
              <li><Link to="/ai/workout-plan">Plan de Entrenamiento IA</Link></li>
              <li><Link to="/ai/meal-plan">Plan de Alimentación IA</Link></li>
              <li><Link to="/progress">Análisis de Progreso</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Síguenos</h4>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FiFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FiTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FiInstagram />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FiGithub />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            &copy; {currentYear} FitnessTrack. Todos los derechos reservados. Hecho con <FiHeart className="heart-icon" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 