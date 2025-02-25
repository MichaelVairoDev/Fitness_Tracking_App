import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { FiUser, FiLock, FiUserCheck } from 'react-icons/fi';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { login, loginUser, loginTestUser } from '../redux/auth/authSlice';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Usar la acción asíncrona loginUser del slice
      const resultAction = await dispatch(loginUser({ email, password }));
      
      if (loginUser.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      } else if (loginUser.rejected.match(resultAction)) {
        setError(resultAction.payload || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTestUserLogin = () => {
    dispatch(loginTestUser());
    navigate('/dashboard');
  };

  return (
    <Container className="login-container my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="login-card shadow">
            <Card.Body className="p-5">
              <div className="login-header">
                <h2 className="login-title">Iniciar Sesión</h2>
                <p className="login-subtitle">Ingresa tus credenciales para acceder a tu cuenta</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit} className="login-form">
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Correo electrónico</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiUser />
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Contraseña</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiLock />
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>
                
                <div className="forgot-password">
                  <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                </div>
                
                <Button
                  type="submit"
                  className="login-btn"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
                
                <div className="login-divider">
                  <span>o</span>
                </div>
                
                <Button
                  type="button"
                  variant="outline-primary"
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleTestUserLogin}
                >
                  <FiUserCheck /> Iniciar con Usuario de Prueba
                </Button>
                
                <div className="login-footer">
                  <p>
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register">Regístrate</Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 