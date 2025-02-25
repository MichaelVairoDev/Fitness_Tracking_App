import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/auth/authSlice';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiActivity, FiCalendar, FiBarChart2 } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.auth);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    closeMenu();
  };
  
  return (
    <header className="header">
      <div className="container header-container">
        <div className="header-brand">
          <Link to="/" onClick={closeMenu}>
            <h1>FitnessTrack</h1>
          </Link>
        </div>
        
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
        
        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" onClick={closeMenu}>
                <FiHome className="nav-icon" /> Inicio
              </Link>
            </li>
            
            {currentUser ? (
              <>
                <li>
                  <Link to="/dashboard" onClick={closeMenu}>
                    <FiActivity className="nav-icon" /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/workouts" onClick={closeMenu}>
                    <FiCalendar className="nav-icon" /> Entrenamientos
                  </Link>
                </li>
                <li>
                  <Link to="/nutrition" onClick={closeMenu}>
                    <FiBarChart2 className="nav-icon" /> Nutrición
                  </Link>
                </li>
                <li>
                  <Link to="/progress" onClick={closeMenu}>
                    <FiActivity className="nav-icon" /> Progreso
                  </Link>
                </li>
                <li>
                  <Link to="/profile" onClick={closeMenu}>
                    <FiUser className="nav-icon" /> Perfil
                  </Link>
                </li>
                <li>
                  <button className="btn-logout" onClick={handleLogout}>
                    <FiLogOut className="nav-icon" /> Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={closeMenu}>Iniciar sesión</Link>
                </li>
                <li>
                  <Link to="/register" className="btn-register" onClick={closeMenu}>Registrarse</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 