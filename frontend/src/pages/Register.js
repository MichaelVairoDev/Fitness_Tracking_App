import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { FiUser, FiLock, FiMail, FiUserPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { registerUser } from '../redux/auth/authSlice';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setError('');
    setLoading(true);
    
    try {
      // Usar la acción registerUser del authSlice
      const resultAction = await dispatch(registerUser({
        email: formData.email,
        password: formData.password,
        name: formData.name
      }));
      
      // Si la acción fue exitosa, navegar al dashboard
      if (!resultAction.error) {
        navigate('/dashboard');
      } else {
        // Si hay un error, mostrarlo
        setError(resultAction.payload);
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setError('Error al crear la cuenta. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="register-container my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="register-card shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Crear Cuenta</h2>
                <p className="text-muted">Únete a FitnessTrack y comienza tu viaje hacia un estilo de vida más saludable</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiUser />
                    </span>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Nombre completo"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiMail />
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiLock />
                    </span>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Form.Text className="text-muted">
                    La contraseña debe tener al menos 6 caracteres
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiLock />
                    </span>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirmar contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    label="Acepto los términos y condiciones"
                    required
                  />
                </Form.Group>
                
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 mb-4"
                  disabled={loading}
                >
                  {loading ? (
                    'Creando cuenta...'
                  ) : (
                    <>
                      <FiUserPlus className="me-2" />
                      Registrarse
                    </>
                  )}
                </Button>
                
                <div className="text-center">
                  <p>
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="text-decoration-none fw-bold">
                      Iniciar Sesión
                    </Link>
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

export default Register; 