import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, ProgressBar, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FiActivity, FiBarChart2, FiCalendar, FiTrendingUp, 
  FiPlusCircle, FiAward, FiTarget, FiClock, FiPieChart,
  FiEdit, FiTrash2, FiX, FiSave
} from 'react-icons/fi';
import { Line, Doughnut } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import './Dashboard.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { currentUser, userProfile } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    workoutsCompleted: 0,
    caloriesBurned: 0,
    minutesExercised: 0,
    streakDays: 0
  });
  
  // Datos de ejemplo para los gráficos
  const [chartData, setChartData] = useState({
    weeklyActivity: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Minutos de actividad',
          data: [30, 45, 60, 0, 75, 45, 0],
          borderColor: '#4361ee',
          backgroundColor: 'rgba(67, 97, 238, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    workoutTypes: {
      labels: ['Cardio', 'Fuerza', 'Flexibilidad', 'HIIT'],
      datasets: [
        {
          data: [35, 45, 10, 10],
          backgroundColor: [
            '#4361ee',
            '#3a0ca3',
            '#7209b7',
            '#f72585'
          ],
          borderWidth: 0
        }
      ]
    }
  });
  
  // Datos de ejemplo para próximos entrenamientos
  const [upcomingWorkouts, setUpcomingWorkouts] = useState([
    {
      id: 1,
      title: 'Entrenamiento de fuerza',
      date: '2025-02-25',
      time: '07:00',
      duration: 45
    },
    {
      id: 2,
      title: 'Cardio HIIT',
      date: '2025-02-26',
      time: '18:30',
      duration: 30
    }
  ]);
  
  // Datos de ejemplo para objetivos
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Correr 5km',
      progress: 60,
      target: '5 km',
      current: '3 km'
    },
    {
      id: 2,
      title: 'Perder peso',
      progress: 40,
      target: '5 kg',
      current: '2 kg'
    },
    {
      id: 3,
      title: 'Entrenar 4 días/semana',
      progress: 75,
      target: '4 días',
      current: '3 días'
    }
  ]);
  
  // Estado para el modal de nuevo objetivo
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    current: '',
    progress: 0
  });
  
  // Estado para el modal de nuevo entrenamiento
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    title: '',
    type: 'strength',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    duration: 45,
    exercises: [{ name: '', sets: 3, reps: 12 }]
  });

  // Estado para el modal de detalles de entrenamiento
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Estado para el modo edición de objetivos
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  
  // Simular carga de datos
  useEffect(() => {
    // En una aplicación real, aquí cargaríamos datos desde la API
    // Si tenemos un usuario de prueba, usamos sus datos
    if (userProfile && userProfile.stats) {
      setStats({
        workoutsCompleted: userProfile.stats.totalWorkouts || 12,
        caloriesBurned: userProfile.stats.caloriesBurned || 4500,
        minutesExercised: userProfile.stats.totalMinutes || 360,
        streakDays: userProfile.stats.streakDays || 5
      });
      
      // Si hay entrenamientos recientes, los mostramos
      if (userProfile.recentWorkouts && userProfile.recentWorkouts.length > 0) {
        const formattedWorkouts = userProfile.recentWorkouts.map(workout => ({
          id: workout.id,
          title: workout.type,
          date: workout.date.toISOString().split('T')[0],
          time: '07:00', // Hora por defecto
          duration: workout.duration
        }));
        setUpcomingWorkouts(formattedWorkouts);
      }
    } else {
      // Datos por defecto
      setStats({
        workoutsCompleted: 12,
        caloriesBurned: 4500,
        minutesExercised: 360,
        streakDays: 5
      });
    }
  }, [userProfile]);
  
  // Opciones para los gráficos
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15
        }
      }
    },
    cutout: '70%'
  };

  // Manejar cambios en el formulario de nuevo objetivo
  const handleGoalChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Calcular progreso
  const calculateProgress = () => {
    if (!newGoal.current || !newGoal.target) return 0;
    
    // Intentar convertir a números
    const current = parseFloat(newGoal.current);
    const target = parseFloat(newGoal.target);
    
    if (isNaN(current) || isNaN(target) || target === 0) return 0;
    
    // Calcular porcentaje
    const progress = Math.round((current / target) * 100);
    return Math.min(progress, 100); // No permitir más del 100%
  };
  
  // Guardar nuevo objetivo
  const handleSaveGoal = () => {
    // Validar que todos los campos estén completos
    if (!newGoal.title || !newGoal.target) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    if (isEditingGoal && newGoal.id) {
      // Actualizar objetivo existente
      const updatedGoals = goals.map(goal => 
        goal.id === newGoal.id ? 
        {...newGoal, progress: calculateProgress()} : 
        goal
      );
      setGoals(updatedGoals);
      toast.success('Objetivo actualizado correctamente');
    } else {
      // Crear nuevo objetivo
      const goal = {
        id: Date.now(), // ID único basado en timestamp
        title: newGoal.title,
        target: newGoal.target,
        current: newGoal.current || '0',
        progress: calculateProgress()
      };
      
      // Añadir a la lista de objetivos
      setGoals([...goals, goal]);
      toast.success('Objetivo añadido correctamente');
    }
    
    // Cerrar modal y resetear formulario
    setShowGoalModal(false);
    setNewGoal({
      title: '',
      target: '',
      current: '',
      progress: 0
    });
    setIsEditingGoal(false);
  };
  
  // Editar objetivo
  const handleEditGoal = (goal) => {
    setNewGoal({...goal});
    setIsEditingGoal(true);
    setShowGoalModal(true);
  };
  
  // Eliminar objetivo
  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast.success('Objetivo eliminado correctamente');
  };

  // Ver detalles de entrenamiento
  const handleViewWorkout = (workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutDetails(true);
  };

  // Guardar nuevo entrenamiento
  const handleSaveWorkout = () => {
    // Validar que todos los campos estén completos
    if (!newWorkout.title || !newWorkout.date || !newWorkout.time || !newWorkout.duration) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    // Crear nuevo entrenamiento
    const workout = {
      id: Date.now(), // ID único basado en timestamp
      title: newWorkout.title,
      type: newWorkout.type,
      date: newWorkout.date,
      time: newWorkout.time,
      duration: parseInt(newWorkout.duration)
    };
    
    // Añadir a la lista de entrenamientos
    setUpcomingWorkouts([...upcomingWorkouts, workout]);
    
    // Cerrar modal y resetear formulario
    setShowWorkoutModal(false);
    setNewWorkout({
      title: '',
      type: 'strength',
      date: new Date().toISOString().split('T')[0],
      time: '08:00',
      duration: 45,
      exercises: [{ name: '', sets: 3, reps: 12 }]
    });
    
    toast.success('Entrenamiento añadido correctamente');
  };

  return (
    <Container className="dashboard-container py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="dashboard-title">
            ¡Hola, {currentUser?.name || 'Usuario'}!
          </h1>
          <p className="dashboard-subtitle">
            Aquí tienes un resumen de tu progreso y actividades recientes
          </p>
        </Col>
      </Row>
      
      {/* Tarjetas de estadísticas */}
      <Row className="stats-grid mb-4">
        <Col lg={3} md={6} sm={6} className="mb-3 mb-lg-0">
          <Card className="stat-card h-100 shadow-sm">
            <Card.Body className="p-4">
              <div className="stat-card-inner">
                <div className="stat-icon">
                  <FiActivity />
                </div>
                <div className="stat-content">
                  <h3>{stats.workoutsCompleted}</h3>
                  <p>Entrenamientos</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} sm={6} className="mb-3 mb-lg-0">
          <Card className="stat-card h-100 shadow-sm">
            <Card.Body className="p-4">
              <div className="stat-card-inner">
                <div className="stat-icon">
                  <FiBarChart2 />
                </div>
                <div className="stat-content">
                  <h3>{stats.caloriesBurned}</h3>
                  <p>Calorías</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} sm={6} className="mb-3 mb-lg-0">
          <Card className="stat-card h-100 shadow-sm">
            <Card.Body className="p-4">
              <div className="stat-card-inner">
                <div className="stat-icon">
                  <FiClock />
                </div>
                <div className="stat-content">
                  <h3>{stats.minutesExercised}</h3>
                  <p>Minutos</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} sm={6}>
          <Card className="stat-card h-100 shadow-sm">
            <Card.Body className="p-4">
              <div className="stat-card-inner">
                <div className="stat-icon">
                  <FiTrendingUp />
                </div>
                <div className="stat-content">
                  <h3>{stats.streakDays}</h3>
                  <p>Días seguidos</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Gráficos y Actividad Reciente */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card className="chart-card h-100 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <FiActivity className="me-2" />
                  Actividad Semanal
                </h5>
                <div className="chart-actions">
                  <Button variant="outline-primary" size="sm">Esta semana</Button>
                </div>
              </div>
              <div className="chart-container">
                <Line data={chartData.weeklyActivity} options={lineOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="chart-card h-100 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="card-title mb-3">
                <FiPieChart className="me-2" />
                Tipos de Entrenamiento
              </h5>
              <div className="chart-container" style={{ height: '220px' }}>
                <Doughnut data={chartData.workoutTypes} options={doughnutOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Próximos entrenamientos y objetivos */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100 dashboard-card shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <FiCalendar className="me-2" />
                  Próximos Entrenamientos
                </h5>
                <Button variant="primary" size="sm" onClick={() => setShowWorkoutModal(true)}>
                  <FiPlusCircle className="me-1" /> Nuevo
                </Button>
              </div>
              
              {upcomingWorkouts.length > 0 ? (
                <div className="workout-list">
                  {upcomingWorkouts.map(workout => (
                    <div key={workout.id} className="workout-item p-3 mb-3 border rounded">
                      <div className="workout-icon">
                        <FiActivity />
                      </div>
                      <div className="workout-details">
                        <h6>{workout.title}</h6>
                        <p>
                          {new Date(workout.date).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          }).replace(/^\w/, c => c.toUpperCase())} • {workout.time} • {workout.duration} min
                        </p>
                      </div>
                      <div className="workout-actions">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleViewWorkout(workout)}
                        >
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {upcomingWorkouts.length < 3 && (
                    <div 
                      className="add-more-link"
                      onClick={() => setShowWorkoutModal(true)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="add-more-item p-3 border rounded text-center">
                        <div className="add-icon">
                          <FiPlusCircle />
                        </div>
                        <p className="mb-0 mt-2">Añadir nuevo entrenamiento</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 empty-state">
                  <div className="empty-icon">
                    <FiCalendar />
                  </div>
                  <p className="text-muted">No tienes entrenamientos programados</p>
                  <Button 
                    variant="primary"
                    onClick={() => setShowWorkoutModal(true)}
                  >
                    Programar entrenamiento
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-4">
          <Card className="h-100 dashboard-card shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <FiTarget className="me-2" />
                  Mis Objetivos
                </h5>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => {
                    setIsEditingGoal(false);
                    setNewGoal({
                      title: '',
                      target: '',
                      current: '',
                      progress: 0
                    });
                    setShowGoalModal(true);
                  }}
                >
                  <FiPlusCircle className="me-1" /> Añadir
                </Button>
              </div>
              
              {goals.length > 0 ? (
                <div className="goal-list">
                  {goals.map(goal => (
                    <div key={goal.id} className="goal-item mb-3 p-3 border rounded">
                      <div className="d-flex justify-content-between mb-1">
                        <h6 className="mb-0">{goal.title}</h6>
                        <div>
                          <Button 
                            variant="link" 
                            className="p-0 text-primary me-2"
                            onClick={() => handleEditGoal(goal)}
                          >
                            <FiEdit size={14} />
                          </Button>
                          <Button 
                            variant="link" 
                            className="p-0 text-danger"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <FiTrash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <ProgressBar 
                        now={goal.progress} 
                        variant={goal.progress >= 75 ? "success" : goal.progress >= 50 ? "primary" : "info"} 
                        className="mb-1"
                      />
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Actual: {goal.current}</small>
                        <small className="text-muted">Meta: {goal.target}</small>
                      </div>
                    </div>
                  ))}
                  
                  {goals.length < 4 && (
                    <div 
                      className="add-more-link"
                      onClick={() => {
                        setIsEditingGoal(false);
                        setNewGoal({
                          title: '',
                          target: '',
                          current: '',
                          progress: 0
                        });
                        setShowGoalModal(true);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="add-more-item p-3 border rounded text-center">
                        <div className="add-icon">
                          <FiPlusCircle />
                        </div>
                        <p className="mb-0 mt-2">Añadir nuevo objetivo</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 empty-state">
                  <div className="empty-icon">
                    <FiTarget />
                  </div>
                  <p className="text-muted">No tienes objetivos establecidos</p>
                  <Button 
                    variant="primary"
                    onClick={() => {
                      setIsEditingGoal(false);
                      setNewGoal({
                        title: '',
                        target: '',
                        current: '',
                        progress: 0
                      });
                      setShowGoalModal(true);
                    }}
                  >
                    Establecer objetivos
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Modal para nuevo objetivo */}
      <Modal 
        show={showGoalModal} 
        onHide={() => {
          setShowGoalModal(false);
          setIsEditingGoal(false);
        }}
        centered
        backdrop="static"
        className="goal-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditingGoal ? 'Editar Objetivo' : 'Nuevo Objetivo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título del objetivo</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newGoal.title}
                onChange={handleGoalChange}
                placeholder="Ej: Correr 5km, Perder peso, etc."
                required
              />
            </Form.Group>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Meta</Form.Label>
                  <Form.Control
                    type="text"
                    name="target"
                    value={newGoal.target}
                    onChange={handleGoalChange}
                    placeholder="Ej: 5 km, 10 kg, etc."
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Progreso actual</Form.Label>
                  <Form.Control
                    type="text"
                    name="current"
                    value={newGoal.current}
                    onChange={handleGoalChange}
                    placeholder="Ej: 2 km, 3 kg, etc."
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {(newGoal.current && newGoal.target) && (
              <div className="preview-progress mb-3">
                <p className="mb-1">Vista previa del progreso:</p>
                <ProgressBar 
                  now={calculateProgress()} 
                  variant={calculateProgress() >= 75 ? "success" : calculateProgress() >= 50 ? "primary" : "info"} 
                  className="mb-1"
                />
                <div className="d-flex justify-content-between">
                  <small className="text-muted">Actual: {newGoal.current}</small>
                  <small className="text-muted">Meta: {newGoal.target}</small>
                </div>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowGoalModal(false);
              setIsEditingGoal(false);
            }}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveGoal}>
            <FiSave className="me-1" /> {isEditingGoal ? 'Actualizar' : 'Guardar'} Objetivo
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para nuevo entrenamiento */}
      <Modal 
        show={showWorkoutModal} 
        onHide={() => setShowWorkoutModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Entrenamiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group controlId="workoutTitle">
                  <Form.Label>Título del entrenamiento</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={newWorkout.title}
                    onChange={(e) => setNewWorkout({...newWorkout, title: e.target.value})}
                    placeholder="Ej: Entrenamiento de fuerza - Piernas"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="workoutType">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    name="type"
                    value={newWorkout.type}
                    onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})}
                  >
                    <option value="strength">Fuerza</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibility">Flexibilidad</option>
                    <option value="hiit">HIIT</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="workoutDate">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={newWorkout.date}
                    onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="workoutTime">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={newWorkout.time}
                    onChange={(e) => setNewWorkout({...newWorkout, time: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="workoutDuration">
                  <Form.Label>Duración (minutos)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWorkoutModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveWorkout}>
            Guardar Entrenamiento
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para detalles de entrenamiento */}
      <Modal 
        show={showWorkoutDetails} 
        onHide={() => setShowWorkoutDetails(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Entrenamiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWorkout && (
            <div>
              <h5 className="mb-3">{selectedWorkout.title}</h5>
              <p className="mb-2">
                <FiCalendar className="me-2" />
                <strong>Fecha:</strong> {new Date(selectedWorkout.date).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric'
                }).replace(/^\w/, c => c.toUpperCase())}
              </p>
              <p className="mb-2">
                <FiClock className="me-2" />
                <strong>Hora:</strong> {selectedWorkout.time}
              </p>
              <p className="mb-2">
                <FiActivity className="me-2" />
                <strong>Duración:</strong> {selectedWorkout.duration} minutos
              </p>
              <p className="mb-0">
                <FiBarChart2 className="me-2" />
                <strong>Tipo:</strong> {
                  selectedWorkout.type === 'strength' ? 'Fuerza' : 
                  selectedWorkout.type === 'cardio' ? 'Cardio' : 
                  selectedWorkout.type === 'flexibility' ? 'Flexibilidad' : 
                  selectedWorkout.type === 'hiit' ? 'HIIT' : 'Otro'
                }
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWorkoutDetails(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard; 