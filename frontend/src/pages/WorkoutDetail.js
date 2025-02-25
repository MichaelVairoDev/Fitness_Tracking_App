import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, ProgressBar } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiActivity, FiEdit, FiTrash2, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Workouts.css';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de datos desde una API
    setTimeout(() => {
      // Datos de ejemplo (en una aplicación real, esto vendría de una API)
      const mockWorkout = {
        id: parseInt(id),
        title: 'Entrenamiento de fuerza - Piernas',
        type: 'strength',
        date: '2025-02-24',
        time: '18:00',
        duration: 45,
        calories: 320,
        completed: true,
        notes: 'Aumentar peso en sentadillas la próxima vez. Mantener una buena forma en el peso muerto.',
        exercises: [
          { 
            id: 1, 
            name: 'Sentadillas', 
            sets: 4, 
            reps: 12, 
            weight: 60, 
            completed: true,
            notes: 'Mantener la espalda recta'
          },
          { 
            id: 2, 
            name: 'Peso muerto', 
            sets: 3, 
            reps: 10, 
            weight: 80, 
            completed: true,
            notes: 'Cuidar la técnica'
          },
          { 
            id: 3, 
            name: 'Prensa de piernas', 
            sets: 3, 
            reps: 15, 
            weight: 120, 
            completed: true,
            notes: ''
          }
        ]
      };
      
      setWorkout(mockWorkout);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Formatear la fecha para mostrarla de forma amigable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Determinar la etiqueta y color según el tipo de entrenamiento
  const getWorkoutTypeLabel = (type) => {
    switch(type) {
      case 'strength':
        return { text: 'Fuerza', variant: 'primary' };
      case 'cardio':
        return { text: 'Cardio', variant: 'success' };
      case 'flexibility':
        return { text: 'Flexibilidad', variant: 'info' };
      case 'hiit':
        return { text: 'HIIT', variant: 'warning' };
      default:
        return { text: 'Otro', variant: 'secondary' };
    }
  };

  const handleMarkAsComplete = () => {
    setWorkout(prev => ({...prev, completed: true}));
    toast.success('Entrenamiento marcado como completado');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando detalles del entrenamiento...</p>
      </Container>
    );
  }

  return (
    <Container className="workout-detail-container py-4">
      <Button 
        variant="link" 
        className="d-inline-flex align-items-center mb-4 ps-0 text-decoration-none"
        onClick={() => navigate('/workouts')}
      >
        <FiArrowLeft className="me-2" /> Volver a entrenamientos
      </Button>
      
      <div className="d-flex flex-wrap justify-content-between align-items-start mb-4">
        <div>
          <div className="d-flex align-items-center">
            <h1 className="page-title me-3">{workout.title}</h1>
            <Badge 
              bg={getWorkoutTypeLabel(workout.type).variant}
              className="workout-badge fs-6"
            >
              {getWorkoutTypeLabel(workout.type).text}
            </Badge>
            {workout.completed && (
              <Badge bg="success" className="ms-2 fs-6">Completado</Badge>
            )}
          </div>
          <div className="workout-meta mt-2">
            <span className="workout-date me-3">
              <FiCalendar className="me-1" />
              {formatDate(workout.date)} - {workout.time}
            </span>
            <span className="workout-duration me-3">
              <FiClock className="me-1" />
              {workout.duration} minutos
            </span>
            <span className="workout-calories">
              <FiActivity className="me-1" />
              {workout.calories} calorías
            </span>
          </div>
        </div>
        
        <div className="workout-detail-actions d-flex mt-3 mt-md-0">
          <Button 
            variant="outline-primary" 
            className="me-2"
            onClick={() => navigate(`/workouts/edit/${id}`)}
          >
            <FiEdit className="me-2" /> Editar
          </Button>
          
          {!workout.completed && (
            <Button 
              variant="success" 
              onClick={handleMarkAsComplete}
            >
              <FiCheck className="me-2" /> Marcar como completado
            </Button>
          )}
        </div>
      </div>
      
      {workout.notes && (
        <Card className="mb-4 workout-notes-card">
          <Card.Body>
            <Card.Title className="fs-5 mb-3">Notas</Card.Title>
            <p className="mb-0">{workout.notes}</p>
          </Card.Body>
        </Card>
      )}
      
      <Card className="workout-exercises-card">
        <Card.Body>
          <Card.Title className="fs-5 mb-3">Ejercicios</Card.Title>
          
          <div className="exercise-list">
            <div className="table-responsive">
              <Table className="workout-exercise-table">
                <thead>
                  <tr>
                    <th>Ejercicio</th>
                    <th className="text-center">Series</th>
                    <th className="text-center">Repeticiones</th>
                    <th className="text-center">Peso (kg)</th>
                    <th>Notas</th>
                    <th className="text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {workout.exercises.map(exercise => (
                    <tr key={exercise.id}>
                      <td>{exercise.name}</td>
                      <td className="text-center">{exercise.sets}</td>
                      <td className="text-center">{exercise.reps}</td>
                      <td className="text-center">{exercise.weight || '-'}</td>
                      <td>{exercise.notes || '-'}</td>
                      <td className="text-center">
                        {exercise.completed ? (
                          <Badge bg="success" pill>Completado</Badge>
                        ) : (
                          <Badge bg="secondary" pill>Pendiente</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
          
          <div className="mt-4">
            <h6>Progreso del entrenamiento</h6>
            <ProgressBar 
              now={workout.completed ? 100 : (workout.exercises.filter(e => e.completed).length / workout.exercises.length) * 100} 
              variant={workout.completed ? "success" : "primary"}
              className="mt-2"
            />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default WorkoutDetail; 