import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Nav, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiMail, FiLock, FiEdit, FiSave, FiTarget, FiActivity, FiSettings } from 'react-icons/fi';
import { updateUserData } from '../redux/auth/authSlice';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { currentUser } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessGoals: [],
    dietaryPreferences: []
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  
  // Cargar datos del usuario
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        age: currentUser.age || '',
        gender: currentUser.gender || '',
        height: currentUser.height || '',
        weight: currentUser.weight || '',
        fitnessGoals: currentUser.fitnessGoals || [],
        dietaryPreferences: currentUser.dietaryPreferences || []
      });
    }
  }, [currentUser]);
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Manejar cambios en los objetivos de fitness
  const handleGoalChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prevState => ({
        ...prevState,
        fitnessGoals: [...prevState.fitnessGoals, value]
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        fitnessGoals: prevState.fitnessGoals.filter(goal => goal !== value)
      }));
    }
  };
  
  // Manejar cambios en las preferencias dietéticas
  const handleDietChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prevState => ({
        ...prevState,
        dietaryPreferences: [...prevState.dietaryPreferences, value]
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        dietaryPreferences: prevState.dietaryPreferences.filter(pref => pref !== value)
      }));
    }
  };
  
  // Guardar cambios del perfil
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // En una aplicación real, aquí enviaríamos los datos al backend
      dispatch(updateUserData(formData));
      setIsEditing(false);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      setError('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
      toast.error('Error al actualizar el perfil');
    }
  };
  
  // Cambiar contraseña
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    // Validar longitud mínima
    if (passwordData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      // En una aplicación real, aquí enviaríamos los datos al backend
      toast.success('Contraseña actualizada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError('Error al actualizar la contraseña. Por favor, inténtalo de nuevo.');
      toast.error('Error al actualizar la contraseña');
    }
  };

  return (
    <Container className="profile-container py-4">
      <h1 className="page-title mb-4">Mi Perfil</h1>
      
      <Row>
        <Col lg={3} md={4} className="mb-4">
          <Card className="profile-sidebar">
            <div className="profile-avatar">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName} 
                  className="avatar-img"
                />
              ) : (
                <div className="avatar-placeholder">
                  {currentUser?.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="avatar-edit">
                <FiEdit />
              </div>
            </div>
            
            <div className="profile-info text-center">
              <h5>{currentUser?.displayName || 'Usuario'}</h5>
              <p className="text-muted">{currentUser?.email}</p>
            </div>
            
            <Nav variant="pills" className="flex-column profile-nav" activeKey={activeTab} onSelect={setActiveTab}>
              <Nav.Item>
                <Nav.Link eventKey="personal">
                  <FiUser className="me-2" /> Información Personal
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fitness">
                  <FiActivity className="me-2" /> Objetivos de Fitness
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="security">
                  <FiLock className="me-2" /> Seguridad
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="preferences">
                  <FiSettings className="me-2" /> Preferencias
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card>
        </Col>
        
        <Col lg={9} md={8}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">
                  {activeTab === 'personal' && 'Información Personal'}
                  {activeTab === 'fitness' && 'Objetivos de Fitness'}
                  {activeTab === 'security' && 'Seguridad'}
                  {activeTab === 'preferences' && 'Preferencias'}
                </h5>
                
                {activeTab === 'personal' && !isEditing && (
                  <Button 
                    variant="outline-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <FiEdit className="me-2" /> Editar
                  </Button>
                )}
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Tab.Content>
                <Tab.Pane active={activeTab === 'personal'}>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre completo</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Correo electrónico</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={true}
                            required
                          />
                          <Form.Text className="text-muted">
                            El correo electrónico no se puede cambiar
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Edad</Form.Label>
                          <Form.Control
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Género</Form.Label>
                          <Form.Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            disabled={!isEditing}
                          >
                            <option value="">Seleccionar</option>
                            <option value="male">Masculino</option>
                            <option value="female">Femenino</option>
                            <option value="other">Otro</option>
                            <option value="prefer-not-to-say">Prefiero no decirlo</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Altura (cm)</Form.Label>
                          <Form.Control
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Peso (kg)</Form.Label>
                          <Form.Control
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    {isEditing && (
                      <div className="d-flex justify-content-end mt-3">
                        <Button 
                          variant="outline-secondary" 
                          className="me-2"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          variant="primary" 
                          type="submit"
                        >
                          <FiSave className="me-2" /> Guardar Cambios
                        </Button>
                      </div>
                    )}
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane active={activeTab === 'fitness'}>
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <h6 className="mb-3">Objetivos de Fitness</h6>
                      <div className="goals-checkboxes">
                        <Row>
                          <Col md={6} lg={4}>
                            <Form.Check 
                              type="checkbox"
                              id="goal-weight-loss"
                              label="Pérdida de peso"
                              value="weight-loss"
                              checked={formData.fitnessGoals.includes('weight-loss')}
                              onChange={handleGoalChange}
                              className="goal-checkbox mb-3"
                            />
                          </Col>
                          <Col md={6} lg={4}>
                            <Form.Check 
                              type="checkbox"
                              id="goal-muscle-gain"
                              label="Ganancia muscular"
                              value="muscle-gain"
                              checked={formData.fitnessGoals.includes('muscle-gain')}
                              onChange={handleGoalChange}
                              className="goal-checkbox mb-3"
                            />
                          </Col>
                          <Col md={6} lg={4}>
                            <Form.Check 
                              type="checkbox"
                              id="goal-endurance"
                              label="Mejorar resistencia"
                              value="endurance"
                              checked={formData.fitnessGoals.includes('endurance')}
                              onChange={handleGoalChange}
                              className="goal-checkbox mb-3"
                            />
                          </Col>
                          <Col md={6} lg={4}>
                            <Form.Check 
                              type="checkbox"
                              id="goal-flexibility"
                              label="Aumentar flexibilidad"
                              value="flexibility"
                              checked={formData.fitnessGoals.includes('flexibility')}
                              onChange={handleGoalChange}
                              className="goal-checkbox mb-3"
                            />
                          </Col>
                          <Col md={6} lg={4}>
                            <Form.Check 
                              type="checkbox"
                              id="goal-strength"
                              label="Aumentar fuerza"
                              value="strength"
                              checked={formData.fitnessGoals.includes('strength')}
                              onChange={handleGoalChange}
                              className="goal-checkbox mb-3"
                            />
                          </Col>
                          <Col md={6} lg={4}>
                            <Form.Check 
                              type="checkbox"
                              id="goal-balance"
                              label="Mejorar equilibrio"
                              value="balance"
                              checked={formData.fitnessGoals.includes('balance')}
                              onChange={handleGoalChange}
                              className="goal-checkbox mb-3"
                            />
                          </Col>
                        </Row>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h6 className="mb-3">Preferencias Dietéticas</h6>
                      <div className="diet-checkboxes">
                        <Row>
                          <Col md={6} lg={4}>
                            <Form.Check 
                              type="checkbox"
                              id="diet-vegetarian"
                              label="Vegetariano"
                              value="vegetarian"
                              checked={formData.dietaryPreferences.includes('vegetarian')}
                              onChange={handleDietChange}
                              className="diet-checkbox mb-3"
                            />
                          </Col>
                          <Col md={6} lg={4}>
                            <Form.Check 
                              type="checkbox"
                              id="diet-vegan"
                              label="Vegano"
                              value="vegan"
                              checked={formData.dietaryPreferences.includes('vegan')}
                              onChange={handleDietChange}
                              className="diet-checkbox mb-3"
                            />
                          </Col>
                          <Col md={6} lg={4}>
                            <Form.Check 
                              type="checkbox"
                              id="diet-keto"
                              label="Keto"
                              value="keto"
                              checked={formData.dietaryPreferences.includes('keto')}
                              onChange={handleDietChange}
                              className="diet-checkbox mb-3"
                            />
                          </Col>
                          <Col md={6} lg={4}>
                            <Form.Check 
                              type="checkbox"
                              id="diet-paleo"
                              label="Paleo"
                              value="paleo"
                              checked={formData.dietaryPreferences.includes('paleo')}
                              onChange={handleDietChange}
                              className="diet-checkbox mb-3"
                            />
                          </Col>
                          <Col md={6} lg={4}>
                            <Form.Check 
                              type="checkbox"
                              id="diet-gluten-free"
                              label="Sin gluten"
                              value="gluten-free"
                              checked={formData.dietaryPreferences.includes('gluten-free')}
                              onChange={handleDietChange}
                              className="diet-checkbox mb-3"
                            />
                          </Col>
                          <Col md={6} lg={4}>
                            <Form.Check 
                              type="checkbox"
                              id="diet-lactose-free"
                              label="Sin lactosa"
                              value="lactose-free"
                              checked={formData.dietaryPreferences.includes('lactose-free')}
                              onChange={handleDietChange}
                              className="diet-checkbox mb-3"
                            />
                          </Col>
                        </Row>
                      </div>
                    </div>

                    <div className="fitness-goals-summary mb-4">
                      <h6 className="mb-3">Resumen de Objetivos</h6>
                      <Card className="goals-summary-card">
                        <Card.Body>
                          {formData.fitnessGoals.length > 0 ? (
                            <div className="d-flex flex-wrap">
                              {formData.fitnessGoals.map(goal => (
                                <Badge 
                                  key={goal} 
                                  bg="primary" 
                                  className="goal-badge me-2 mb-2 py-2 px-3"
                                >
                                  {goal === 'weight-loss' && 'Pérdida de peso'}
                                  {goal === 'muscle-gain' && 'Ganancia muscular'}
                                  {goal === 'endurance' && 'Mejorar resistencia'}
                                  {goal === 'flexibility' && 'Aumentar flexibilidad'}
                                  {goal === 'strength' && 'Aumentar fuerza'}
                                  {goal === 'balance' && 'Mejorar equilibrio'}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted mb-0">No has seleccionado ningún objetivo de fitness.</p>
                          )}
                        </Card.Body>
                      </Card>
                    </div>
                    
                    <div className="d-flex justify-content-end mt-4">
                      <Button 
                        variant="primary" 
                        type="submit"
                      >
                        <FiSave className="me-2" /> Guardar Preferencias
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane active={activeTab === 'security'}>
                  <Form onSubmit={handlePasswordSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña actual</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Nueva contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                      <Form.Text className="text-muted">
                        La contraseña debe tener al menos 6 caracteres
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmar nueva contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end mt-3">
                      <Button 
                        variant="primary" 
                        type="submit"
                      >
                        <FiSave className="me-2" /> Cambiar Contraseña
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane active={activeTab === 'preferences'}>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Idioma</Form.Label>
                      <Form.Select>
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Unidades de medida</Form.Label>
                      <Form.Select>
                        <option value="metric">Métrico (kg, cm)</option>
                        <option value="imperial">Imperial (lb, in)</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="dark-mode-switch"
                        label="Modo oscuro"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="notifications-switch"
                        label="Recibir notificaciones"
                        defaultChecked
                      />
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end mt-3">
                      <Button 
                        variant="primary" 
                        type="submit"
                      >
                        <FiSave className="me-2" /> Guardar Preferencias
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 