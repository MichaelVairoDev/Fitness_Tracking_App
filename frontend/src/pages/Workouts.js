import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Dropdown, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiSearch, FiFilter, FiPlus, FiCalendar, FiClock, 
  FiActivity, FiBarChart2, FiChevronRight, FiTrash2, FiEdit,
  FiX, FiCheck, FiList
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Workouts.css';

const Workouts = () => {
  const dispatch = useDispatch();
  const { currentUser, userProfile } = useSelector(state => state.auth);
  
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [loading, setLoading] = useState(true);
  
  // Estado para el modal de nuevo entrenamiento
  const [showModal, setShowModal] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    title: '',
    type: 'strength',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    duration: 45,
    exercises: [{ name: '', sets: 3, reps: 12 }]
  });

  // Estado para el modal de detalles de entrenamiento
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Datos de ejemplo para los entrenamientos
  useEffect(() => {
    // Simular carga de datos desde una API
    setTimeout(() => {
      const mockWorkouts = [
        {
          id: 1,
          title: 'Entrenamiento de fuerza - Piernas',
          type: 'strength',
          date: '2025-02-24',
          duration: 45,
          calories: 320,
          completed: true,
          exercises: [
            { name: 'Sentadillas', sets: 4, reps: 12 },
            { name: 'Peso muerto', sets: 3, reps: 10 },
            { name: 'Prensa de piernas', sets: 3, reps: 15 }
          ]
        },
        {
          id: 2,
          title: 'Cardio HIIT',
          type: 'cardio',
          date: '2025-02-22',
          duration: 30,
          calories: 280,
          completed: true,
          exercises: [
            { name: 'Burpees', sets: 4, reps: '30 seg' },
            { name: 'Mountain climbers', sets: 4, reps: '30 seg' },
            { name: 'Jumping jacks', sets: 4, reps: '30 seg' }
          ]
        },
        {
          id: 3,
          title: 'Entrenamiento de fuerza - Pecho y espalda',
          type: 'strength',
          date: '2025-02-20',
          duration: 50,
          calories: 350,
          completed: true,
          exercises: [
            { name: 'Press de banca', sets: 4, reps: 10 },
            { name: 'Remo con barra', sets: 3, reps: 12 },
            { name: 'Pull-ups', sets: 3, reps: 8 }
          ]
        },
        {
          id: 4,
          title: 'Yoga para flexibilidad',
          type: 'flexibility',
          date: '2025-02-18',
          duration: 40,
          calories: 180,
          completed: true,
          exercises: [
            { name: 'Postura del perro boca abajo', sets: 1, reps: '60 seg' },
            { name: 'Postura del guerrero', sets: 1, reps: '60 seg' },
            { name: 'Postura del árbol', sets: 1, reps: '60 seg' }
          ]
        },
        {
          id: 5,
          title: 'Entrenamiento de fuerza - Brazos',
          type: 'strength',
          date: '2025-02-26',
          duration: 40,
          calories: 300,
          completed: false,
          exercises: [
            { name: 'Curl de bíceps', sets: 4, reps: 12 },
            { name: 'Extensiones de tríceps', sets: 3, reps: 15 },
            { name: 'Press militar', sets: 3, reps: 10 }
          ]
        },
        {
          id: 6,
          title: 'Carrera de resistencia',
          type: 'cardio',
          date: '2025-02-28',
          duration: 60,
          calories: 450,
          completed: false,
          exercises: [
            { name: 'Carrera continua', sets: 1, reps: '60 min' }
          ]
        }
      ];
      
      // Si hay un usuario de prueba con entrenamientos recientes, los agregamos
      if (userProfile && userProfile.recentWorkouts && userProfile.recentWorkouts.length > 0) {
        const userWorkouts = userProfile.recentWorkouts.map((workout, index) => ({
          id: 100 + index,
          title: `${workout.type} - ${new Date(workout.date).toLocaleDateString('es-ES')}`,
          type: workout.type.toLowerCase(),
          date: workout.date.toISOString().split('T')[0],
          duration: workout.duration,
          calories: workout.duration * 7,
          completed: true,
          exercises: [
            { name: 'Ejercicio 1', sets: 3, reps: 12 },
            { name: 'Ejercicio 2', sets: 3, reps: 10 }
          ]
        }));
        
        mockWorkouts.push(...userWorkouts);
      }
      
      setWorkouts(mockWorkouts);
      setFilteredWorkouts(mockWorkouts);
      setLoading(false);
    }, 1000);
  }, [userProfile]);
  
  // Filtrar y ordenar entrenamientos
  useEffect(() => {
    let result = [...workouts];
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      result = result.filter(workout => 
        workout.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar filtro por tipo
    if (filterType !== 'all') {
      result = result.filter(workout => workout.type === filterType);
    }
    
    // Aplicar ordenación
    switch (sortBy) {
      case 'date-asc':
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'duration-asc':
        result.sort((a, b) => a.duration - b.duration);
        break;
      case 'duration-desc':
        result.sort((a, b) => b.duration - a.duration);
        break;
      case 'calories-asc':
        result.sort((a, b) => a.calories - b.calories);
        break;
      case 'calories-desc':
        result.sort((a, b) => b.calories - a.calories);
        break;
      default:
        break;
    }
    
    setFilteredWorkouts(result);
  }, [workouts, searchTerm, filterType, sortBy]);
  
  // Obtener etiqueta para el tipo de entrenamiento
  const getWorkoutTypeLabel = (type) => {
    switch (type) {
      case 'strength':
        return { text: 'Fuerza', variant: 'primary' };
      case 'cardio':
        return { text: 'Cardio', variant: 'danger' };
      case 'flexibility':
        return { text: 'Flexibilidad', variant: 'info' };
      case 'hiit':
        return { text: 'HIIT', variant: 'warning' };
      default:
        return { text: 'Otro', variant: 'secondary' };
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Eliminar entrenamiento
  const handleDeleteWorkout = (id) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
    toast.success('Entrenamiento eliminado correctamente');
  };
  
  // Marcar como completado
  const handleCompleteWorkout = (id) => {
    const updatedWorkouts = workouts.map(workout => 
      workout.id === id ? {...workout, completed: true} : workout
    );
    setWorkouts(updatedWorkouts);
    toast.success('Entrenamiento marcado como completado');
  };

  // Ver detalles o editar entrenamiento
  const handleViewWorkout = (workout, edit = false) => {
    setSelectedWorkout({...workout});
    setIsEditing(edit);
    setShowDetailsModal(true);
  };

  // Actualizar entrenamiento en edición
  const handleUpdateWorkout = () => {
    if (!selectedWorkout.title || !selectedWorkout.date || !selectedWorkout.duration) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }

    // Validar que todos los ejercicios tengan nombre si hay ejercicios
    if (selectedWorkout.exercises && selectedWorkout.exercises.some(ex => !ex.name)) {
      toast.error('Por favor, completa el nombre de todos los ejercicios');
      return;
    }

    // Actualizar el entrenamiento
    const updatedWorkouts = workouts.map(workout => 
      workout.id === selectedWorkout.id ? selectedWorkout : workout
    );
    setWorkouts(updatedWorkouts);
    setShowDetailsModal(false);
    toast.success('Entrenamiento actualizado correctamente');
  };

  // Manejar cambios en el entrenamiento seleccionado
  const handleSelectedWorkoutChange = (e) => {
    const { name, value } = e.target;
    setSelectedWorkout(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    }));
  };

  // Manejar cambios en los ejercicios del entrenamiento seleccionado
  const handleSelectedExerciseChange = (index, field, value) => {
    if (!selectedWorkout.exercises) return;
    
    const updatedExercises = [...selectedWorkout.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    
    setSelectedWorkout(prev => ({
      ...prev,
      exercises: updatedExercises
    }));
  };

  // Añadir ejercicio al entrenamiento seleccionado
  const addSelectedExercise = () => {
    if (!selectedWorkout.exercises) {
      setSelectedWorkout(prev => ({
        ...prev,
        exercises: [{ name: '', sets: 3, reps: 12 }]
      }));
    } else {
      setSelectedWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, { name: '', sets: 3, reps: 12 }]
      }));
    }
  };

  // Eliminar ejercicio del entrenamiento seleccionado
  const removeSelectedExercise = (index) => {
    if (!selectedWorkout.exercises || selectedWorkout.exercises.length <= 1) return;
    
    const updatedExercises = selectedWorkout.exercises.filter((_, i) => i !== index);
    setSelectedWorkout(prev => ({
      ...prev,
      exercises: updatedExercises
    }));
  };
  
  // Manejar cambios en el formulario de nuevo entrenamiento
  const handleWorkoutChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar cambios en los ejercicios
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...newWorkout.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    setNewWorkout(prev => ({
      ...prev,
      exercises: updatedExercises
    }));
  };
  
  // Añadir ejercicio
  const addExercise = () => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: 3, reps: 12 }]
    }));
  };
  
  // Eliminar ejercicio
  const removeExercise = (index) => {
    if (newWorkout.exercises.length > 1) {
      const updatedExercises = newWorkout.exercises.filter((_, i) => i !== index);
      setNewWorkout(prev => ({
        ...prev,
        exercises: updatedExercises
      }));
    }
  };
  
  // Guardar nuevo entrenamiento
  const handleSaveWorkout = () => {
    // Validar que todos los campos estén completos
    if (!newWorkout.title || !newWorkout.date || !newWorkout.time || !newWorkout.duration) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    // Validar que todos los ejercicios tengan nombre
    if (newWorkout.exercises.some(ex => !ex.name)) {
      toast.error('Por favor, completa el nombre de todos los ejercicios');
      return;
    }
    
    // Crear nuevo entrenamiento
    const workout = {
      id: Date.now(), // ID único basado en timestamp
      title: newWorkout.title,
      type: newWorkout.type,
      date: newWorkout.date,
      time: newWorkout.time,
      duration: parseInt(newWorkout.duration),
      calories: parseInt(newWorkout.duration) * 7, // Cálculo simple de calorías
      completed: false,
      exercises: newWorkout.exercises
    };
    
    // Añadir a la lista de entrenamientos
    setWorkouts([workout, ...workouts]);
    
    // Cerrar modal y resetear formulario
    setShowModal(false);
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
    <Container className="workouts-container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title">Mis Entrenamientos</h1>
          <p className="text-muted">Gestiona tus rutinas y seguimiento de ejercicios</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FiPlus className="me-2" /> Nuevo Entrenamiento
        </Button>
      </div>
      
      {/* Filtros y búsqueda */}
      <Card className="filter-card mb-4 shadow-sm">
        <Card.Body className="p-3">
          <Row>
            <Col md={5}>
              <InputGroup>
                <InputGroup.Text>
                  <FiSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Buscar entrenamientos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FiFilter />
                </InputGroup.Text>
                <Form.Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="strength">Fuerza</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibilidad</option>
                  <option value="hiit">HIIT</option>
                </Form.Select>
              </InputGroup>
            </Col>
            
            <Col md={3}>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Más recientes</option>
                <option value="date-asc">Más antiguos</option>
                <option value="duration-desc">Mayor duración</option>
                <option value="duration-asc">Menor duración</option>
                <option value="calories-desc">Más calorías</option>
                <option value="calories-asc">Menos calorías</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Lista de entrenamientos */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando entrenamientos...</p>
        </div>
      ) : filteredWorkouts.length > 0 ? (
        <div className="workouts-list">
          {filteredWorkouts.map(workout => (
            <Card key={workout.id} className="workout-card mb-3 shadow-sm">
              <Card.Body className="p-4">
                <Row>
                  <Col md={8}>
                    <div className="d-flex align-items-start">
                      <div className={`workout-type-icon ${workout.type}`}>
                        {workout.type === 'strength' && <FiActivity />}
                        {workout.type === 'cardio' && <FiBarChart2 />}
                        {workout.type === 'flexibility' && <FiActivity />}
                        {workout.type === 'hiit' && <FiActivity />}
                      </div>
                      <div className="workout-info">
                        <h5 className="workout-title">{workout.title}</h5>
                        <div className="workout-meta">
                          <span className="workout-date">
                            <FiCalendar className="me-1" />
                            {formatDate(workout.date)}
                          </span>
                          <span className="workout-duration">
                            <FiClock className="me-1" />
                            {workout.duration} minutos
                          </span>
                          <span className="workout-calories">
                            <FiActivity className="me-1" />
                            {workout.calories} calorías
                          </span>
                        </div>
                        <Badge 
                          bg={getWorkoutTypeLabel(workout.type).variant}
                          className="workout-badge"
                        >
                          {getWorkoutTypeLabel(workout.type).text}
                        </Badge>
                        {workout.completed && (
                          <Badge bg="success" className="ms-2">Completado</Badge>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="d-flex justify-content-end align-items-center">
                    <div className="workout-actions">
                      <Button 
                        variant="outline-primary" 
                        className="me-2"
                        onClick={() => handleViewWorkout(workout)}
                      >
                        Ver detalles
                      </Button>
                      <div className="d-inline-flex ms-2">
                        <Button 
                          variant="link" 
                          className="p-1 text-primary"
                          title="Editar"
                          onClick={() => handleViewWorkout(workout, true)}
                        >
                          <FiEdit size={18} />
                        </Button>
                        
                        {!workout.completed && (
                          <Button 
                            variant="link" 
                            className="p-1 text-success"
                            title="Marcar como completado"
                            onClick={() => handleCompleteWorkout(workout.id)}
                          >
                            <FiCheck size={18} />
                          </Button>
                        )}
                        
                        <Button 
                          variant="link" 
                          className="p-1 text-danger"
                          title="Eliminar"
                          onClick={() => handleDeleteWorkout(workout.id)}
                        >
                          <FiTrash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="empty-state-icon">
            <FiActivity />
          </div>
          <h4>No se encontraron entrenamientos</h4>
          <p className="text-muted mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'Prueba a cambiar los filtros de búsqueda' 
              : 'Comienza a registrar tus entrenamientos'}
          </p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FiPlus className="me-2" /> Añadir primer entrenamiento
          </Button>
        </div>
      )}
      
      {/* Modal para nuevo entrenamiento */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
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
                    onChange={handleWorkoutChange}
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
                    onChange={handleWorkoutChange}
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
                    onChange={handleWorkoutChange}
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
                    onChange={handleWorkoutChange}
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
                    onChange={handleWorkoutChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <FiList className="me-2" />
                Ejercicios
              </h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={addExercise}
              >
                <FiPlus className="me-1" /> Añadir ejercicio
              </Button>
            </div>
            
            {newWorkout.exercises.map((exercise, index) => (
              <div key={index} className="exercise-item mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Ejercicio {index + 1}</h6>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeExercise(index)}
                    disabled={newWorkout.exercises.length === 1}
                  >
                    <FiX />
                  </Button>
                </div>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId={`exercise-name-${index}`}>
                      <Form.Label>Nombre del ejercicio</Form.Label>
                      <Form.Control
                        type="text"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        placeholder="Ej: Sentadillas"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId={`exercise-sets-${index}`}>
                      <Form.Label>Series</Form.Label>
                      <Form.Control
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId={`exercise-reps-${index}`}>
                      <Form.Label>Repeticiones</Form.Label>
                      <Form.Control
                        type="text"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        placeholder="Ej: 12 o 30 seg"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveWorkout}>
            Guardar Entrenamiento
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para ver/editar entrenamiento */}
      <Modal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)}
        size={isEditing ? "lg" : "md"}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Editar Entrenamiento' : 'Detalles del Entrenamiento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWorkout && (
            isEditing ? (
              <Form>
                <Row className="mb-3">
                  <Col md={8}>
                    <Form.Group controlId="editWorkoutTitle">
                      <Form.Label>Título del entrenamiento</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={selectedWorkout.title}
                        onChange={handleSelectedWorkoutChange}
                        placeholder="Ej: Entrenamiento de fuerza - Piernas"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="editWorkoutType">
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select
                        name="type"
                        value={selectedWorkout.type}
                        onChange={handleSelectedWorkoutChange}
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
                    <Form.Group controlId="editWorkoutDate">
                      <Form.Label>Fecha</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={selectedWorkout.date}
                        onChange={handleSelectedWorkoutChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="editWorkoutTime">
                      <Form.Label>Hora</Form.Label>
                      <Form.Control
                        type="time"
                        name="time"
                        value={selectedWorkout.time}
                        onChange={handleSelectedWorkoutChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="editWorkoutDuration">
                      <Form.Label>Duración (minutos)</Form.Label>
                      <Form.Control
                        type="number"
                        name="duration"
                        value={selectedWorkout.duration}
                        onChange={handleSelectedWorkoutChange}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">
                        <FiList className="me-2" />
                        Ejercicios
                      </h5>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={addSelectedExercise}
                      >
                        <FiPlus className="me-1" /> Añadir ejercicio
                      </Button>
                    </div>
                    
                    {selectedWorkout.exercises.map((exercise, index) => (
                      <div key={index} className="exercise-item mb-3 p-3 border rounded">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">Ejercicio {index + 1}</h6>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeSelectedExercise(index)}
                            disabled={selectedWorkout.exercises.length === 1}
                          >
                            <FiX />
                          </Button>
                        </div>
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId={`edit-exercise-name-${index}`}>
                              <Form.Label>Nombre del ejercicio</Form.Label>
                              <Form.Control
                                type="text"
                                value={exercise.name}
                                onChange={(e) => handleSelectedExerciseChange(index, 'name', e.target.value)}
                                placeholder="Ej: Sentadillas"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group controlId={`edit-exercise-sets-${index}`}>
                              <Form.Label>Series</Form.Label>
                              <Form.Control
                                type="number"
                                value={exercise.sets}
                                onChange={(e) => handleSelectedExerciseChange(index, 'sets', e.target.value)}
                                min="1"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group controlId={`edit-exercise-reps-${index}`}>
                              <Form.Label>Repeticiones</Form.Label>
                              <Form.Control
                                type="text"
                                value={exercise.reps}
                                onChange={(e) => handleSelectedExerciseChange(index, 'reps', e.target.value)}
                                placeholder="Ej: 12 o 30 seg"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </>
                )}
              </Form>
            ) : (
              <div>
                <div className="mb-4">
                  <h5 className="mb-3">{selectedWorkout.title}</h5>
                  <p className="mb-2">
                    <FiCalendar className="me-2" />
                    <strong>Fecha:</strong> {formatDate(selectedWorkout.date)}
                  </p>
                  <p className="mb-2">
                    <FiClock className="me-2" />
                    <strong>Hora:</strong> {selectedWorkout.time}
                  </p>
                  <p className="mb-2">
                    <FiActivity className="me-2" />
                    <strong>Duración:</strong> {selectedWorkout.duration} minutos
                  </p>
                  <p>
                    <FiBarChart2 className="me-2" />
                    <strong>Calorías estimadas:</strong> {selectedWorkout.calories || selectedWorkout.duration * 7} kcal
                  </p>
                  <p>
                    <Badge 
                      bg={getWorkoutTypeLabel(selectedWorkout.type).variant} 
                      className="workout-badge"
                    >
                      {getWorkoutTypeLabel(selectedWorkout.type).text}
                    </Badge>
                    {selectedWorkout.completed && (
                      <Badge bg="success" className="ms-2">Completado</Badge>
                    )}
                  </p>
                </div>
                
                {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 && (
                  <div>
                    <h6 className="mb-3">Ejercicios:</h6>
                    <div className="table-responsive">
                      <table className="table table-sm table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Nombre</th>
                            <th className="text-center">Series</th>
                            <th className="text-center">Repeticiones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedWorkout.exercises.map((exercise, index) => (
                            <tr key={index}>
                              <td>{exercise.name}</td>
                              <td className="text-center">{exercise.sets}</td>
                              <td className="text-center">{exercise.reps}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Cancelar
          </Button>
          {isEditing && (
            <Button variant="primary" onClick={handleUpdateWorkout}>
              Guardar Cambios
            </Button>
          )}
          {!isEditing && !selectedWorkout?.completed && (
            <Button 
              variant="success" 
              onClick={() => {
                handleCompleteWorkout(selectedWorkout.id);
                setShowDetailsModal(false);
              }}
            >
              Marcar como Completado
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Workouts; 