import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Form, InputGroup, Tabs, Tab, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiPlus, FiCalendar, FiClock, FiActivity, 
  FiPieChart, FiChevronLeft, FiChevronRight,
  FiTrash2, FiEdit, FiX
} from 'react-icons/fi';
import { Doughnut } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './Nutrition.css';

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const Nutrition = () => {
  const dispatch = useDispatch();
  const { currentUser, userProfile } = useSelector(state => state.auth);
  
  const [date, setDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [nutritionSummary, setNutritionSummary] = useState({
    calories: { consumed: 0, goal: 2000 },
    protein: { consumed: 0, goal: 150 },
    carbs: { consumed: 0, goal: 250 },
    fat: { consumed: 0, goal: 70 }
  });
  const [loading, setLoading] = useState(true);
  
  // Estado para el modal de nueva comida
  const [showModal, setShowModal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    time: '08:00',
    foods: [{ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 }]
  });
  
  // Estado para la edición de comidas
  const [isEditing, setIsEditing] = useState(false);
  const [editMealId, setEditMealId] = useState(null);
  
  // Datos de ejemplo para las comidas
  useEffect(() => {
    // Simular carga de datos desde una API
    setTimeout(() => {
      const mockMeals = [
        {
          id: 1,
          name: 'Desayuno',
          time: '08:00',
          foods: [
            { name: 'Avena con leche', calories: 320, protein: 15, carbs: 45, fat: 8 },
            { name: 'Plátano', calories: 105, protein: 1, carbs: 27, fat: 0 },
            { name: 'Café con leche', calories: 60, protein: 3, carbs: 5, fat: 3 }
          ]
        },
        {
          id: 2,
          name: 'Almuerzo',
          time: '13:30',
          foods: [
            { name: 'Pechuga de pollo a la plancha', calories: 250, protein: 35, carbs: 0, fat: 10 },
            { name: 'Arroz integral', calories: 180, protein: 4, carbs: 37, fat: 1 },
            { name: 'Ensalada mixta', calories: 70, protein: 2, carbs: 10, fat: 3 }
          ]
        },
        {
          id: 3,
          name: 'Merienda',
          time: '17:00',
          foods: [
            { name: 'Yogur griego', calories: 150, protein: 15, carbs: 8, fat: 5 },
            { name: 'Nueces', calories: 180, protein: 4, carbs: 4, fat: 18 }
          ]
        },
        {
          id: 4,
          name: 'Cena',
          time: '21:00',
          foods: [
            { name: 'Salmón al horno', calories: 280, protein: 30, carbs: 0, fat: 15 },
            { name: 'Patata asada', calories: 160, protein: 3, carbs: 35, fat: 0 },
            { name: 'Verduras salteadas', calories: 90, protein: 3, carbs: 12, fat: 4 }
          ]
        }
      ];
      
      // Si hay un usuario de prueba con registros de nutrición, los agregamos
      if (userProfile && userProfile.nutritionLogs && userProfile.nutritionLogs.length > 0) {
        const userMeals = [];
        
        userProfile.nutritionLogs.forEach((log, index) => {
          if (log.meals && log.meals.length > 0) {
            log.meals.forEach((meal, mealIndex) => {
              userMeals.push({
                id: 100 + index + mealIndex,
                name: meal.type,
                time: mealIndex === 0 ? '08:00' : mealIndex === 1 ? '13:30' : mealIndex === 2 ? '19:00' : '16:00',
                foods: [
                  { 
                    name: `Comida ${mealIndex + 1}`, 
                    calories: meal.calories, 
                    protein: meal.protein, 
                    carbs: meal.carbs, 
                    fat: meal.fat 
                  }
                ]
              });
            });
          }
        });
        
        if (userMeals.length > 0) {
          mockMeals.push(...userMeals);
        }
      }
      
      setMeals(mockMeals);
      
      // Calcular resumen nutricional
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      
      mockMeals.forEach(meal => {
        meal.foods.forEach(food => {
          totalCalories += food.calories;
          totalProtein += food.protein;
          totalCarbs += food.carbs;
          totalFat += food.fat;
        });
      });
      
      setNutritionSummary({
        calories: { consumed: totalCalories, goal: 2000 },
        protein: { consumed: totalProtein, goal: 150 },
        carbs: { consumed: totalCarbs, goal: 250 },
        fat: { consumed: totalFat, goal: 70 }
      });
      
      setLoading(false);
    }, 1000);
  }, [userProfile]);
  
  // Ordenar comidas por fecha/tiempo reciente
  useEffect(() => {
    // Ordenar comidas por tiempo (más reciente primero)
    const sortedMeals = [...meals].sort((a, b) => {
      // Convertir tiempo a minutos para comparar
      const timeA = a.time.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
      const timeB = b.time.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
      return timeB - timeA; // Orden descendente
    });
    
    setMeals(sortedMeals);
  }, []);
  
  // Cambiar fecha
  const changeDate = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
  };
  
  // Formatear fecha
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  // Calcular porcentaje de macronutrientes
  const calculateMacroPercentage = () => {
    const { protein, carbs, fat } = nutritionSummary;
    const totalGrams = protein.consumed + carbs.consumed + fat.consumed;
    
    if (totalGrams === 0) return [33, 33, 34];
    
    const proteinPercentage = Math.round((protein.consumed / totalGrams) * 100);
    const carbsPercentage = Math.round((carbs.consumed / totalGrams) * 100);
    const fatPercentage = 100 - proteinPercentage - carbsPercentage;
    
    return [proteinPercentage, carbsPercentage, fatPercentage];
  };
  
  // Datos para el gráfico de macronutrientes
  const macroChartData = {
    labels: ['Proteínas', 'Carbohidratos', 'Grasas'],
    datasets: [
      {
        data: calculateMacroPercentage(),
        backgroundColor: [
          '#4361ee',
          '#3a0ca3',
          '#7209b7'
        ],
        borderWidth: 0
      }
    ]
  };
  
  // Opciones para el gráfico
  const chartOptions = {
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
  
  // Calcular calorías totales por comida
  const calculateMealCalories = (meal) => {
    return meal.foods.reduce((total, food) => total + food.calories, 0);
  };
  
  // Manejar cambios en el formulario de nueva comida
  const handleMealChange = (e) => {
    const { name, value } = e.target;
    setNewMeal(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar cambios en los alimentos
  const handleFoodChange = (index, field, value) => {
    const updatedFoods = [...newMeal.foods];
    updatedFoods[index] = {
      ...updatedFoods[index],
      [field]: field === 'name' ? value : parseInt(value) || 0
    };
    setNewMeal(prev => ({
      ...prev,
      foods: updatedFoods
    }));
  };
  
  // Añadir alimento
  const addFood = () => {
    setNewMeal(prev => ({
      ...prev,
      foods: [...prev.foods, { name: '', calories: 0, protein: 0, carbs: 0, fat: 0 }]
    }));
  };
  
  // Eliminar alimento
  const removeFood = (index) => {
    if (newMeal.foods.length > 1) {
      const updatedFoods = newMeal.foods.filter((_, i) => i !== index);
      setNewMeal(prev => ({
        ...prev,
        foods: updatedFoods
      }));
    }
  };
  
  // Editar comida
  const handleEditMeal = (meal) => {
    setNewMeal({...meal});
    setIsEditing(true);
    setEditMealId(meal.id);
    setShowModal(true);
  };
  
  // Guardar nueva comida o actualizar existente
  const handleSaveMeal = () => {
    // Validar que todos los campos estén completos
    if (!newMeal.name || !newMeal.time) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    // Validar que todos los alimentos tengan nombre
    if (newMeal.foods.some(food => !food.name)) {
      toast.error('Por favor, completa el nombre de todos los alimentos');
      return;
    }
    
    if (isEditing) {
      // Actualizar comida existente
      const mealToUpdate = meals.find(meal => meal.id === editMealId);
      
      if (mealToUpdate) {
        // Calcular diferencias para actualizar el resumen nutricional
        const oldCalories = mealToUpdate.foods.reduce((total, food) => total + food.calories, 0);
        const oldProtein = mealToUpdate.foods.reduce((total, food) => total + food.protein, 0);
        const oldCarbs = mealToUpdate.foods.reduce((total, food) => total + food.carbs, 0);
        const oldFat = mealToUpdate.foods.reduce((total, food) => total + food.fat, 0);
        
        const newCalories = newMeal.foods.reduce((total, food) => total + food.calories, 0);
        const newProtein = newMeal.foods.reduce((total, food) => total + food.protein, 0);
        const newCarbs = newMeal.foods.reduce((total, food) => total + food.carbs, 0);
        const newFat = newMeal.foods.reduce((total, food) => total + food.fat, 0);
        
        // Actualizar resumen nutricional
        setNutritionSummary(prev => ({
          calories: { ...prev.calories, consumed: prev.calories.consumed - oldCalories + newCalories },
          protein: { ...prev.protein, consumed: prev.protein.consumed - oldProtein + newProtein },
          carbs: { ...prev.carbs, consumed: prev.carbs.consumed - oldCarbs + newCarbs },
          fat: { ...prev.fat, consumed: prev.fat.consumed - oldFat + newFat }
        }));
        
        // Actualizar la comida
        const updatedMeals = meals.map(meal => 
          meal.id === editMealId ? newMeal : meal
        );
        setMeals(updatedMeals);
        
        toast.success('Comida actualizada correctamente');
      }
    } else {
      // Crear nueva comida
      const meal = {
        id: Date.now(), // ID único basado en timestamp
        name: newMeal.name,
        time: newMeal.time,
        foods: newMeal.foods
      };
      
      // Añadir a la lista de comidas (al principio para mostrar más recientes primero)
      setMeals([meal, ...meals]);
      
      // Actualizar resumen nutricional
      const newCalories = newMeal.foods.reduce((total, food) => total + food.calories, 0);
      const newProtein = newMeal.foods.reduce((total, food) => total + food.protein, 0);
      const newCarbs = newMeal.foods.reduce((total, food) => total + food.carbs, 0);
      const newFat = newMeal.foods.reduce((total, food) => total + food.fat, 0);
      
      setNutritionSummary(prev => ({
        calories: { ...prev.calories, consumed: prev.calories.consumed + newCalories },
        protein: { ...prev.protein, consumed: prev.protein.consumed + newProtein },
        carbs: { ...prev.carbs, consumed: prev.carbs.consumed + newCarbs },
        fat: { ...prev.fat, consumed: prev.fat.consumed + newFat }
      }));
      
      toast.success('Comida añadida correctamente');
    }
    
    // Cerrar modal y resetear formulario
    setShowModal(false);
    setNewMeal({
      name: '',
      time: '08:00',
      foods: [{ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 }]
    });
    setIsEditing(false);
    setEditMealId(null);
  };
  
  // Eliminar comida
  const handleDeleteMeal = (id) => {
    // Encontrar la comida a eliminar
    const mealToDelete = meals.find(meal => meal.id === id);
    
    if (mealToDelete) {
      // Actualizar resumen nutricional
      const deletedCalories = mealToDelete.foods.reduce((total, food) => total + food.calories, 0);
      const deletedProtein = mealToDelete.foods.reduce((total, food) => total + food.protein, 0);
      const deletedCarbs = mealToDelete.foods.reduce((total, food) => total + food.carbs, 0);
      const deletedFat = mealToDelete.foods.reduce((total, food) => total + food.fat, 0);
      
      setNutritionSummary(prev => ({
        calories: { ...prev.calories, consumed: prev.calories.consumed - deletedCalories },
        protein: { ...prev.protein, consumed: prev.protein.consumed - deletedProtein },
        carbs: { ...prev.carbs, consumed: prev.carbs.consumed - deletedCarbs },
        fat: { ...prev.fat, consumed: prev.fat.consumed - deletedFat }
      }));
      
      // Eliminar la comida
      setMeals(meals.filter(meal => meal.id !== id));
      toast.success('Comida eliminada correctamente');
    }
  };

  return (
    <Container className="nutrition-container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title">Nutrición</h1>
          <p className="text-muted">Seguimiento de comidas y nutrientes</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FiPlus className="me-2" /> Añadir Comida
        </Button>
      </div>
      
      {/* Selector de fecha */}
      <Card className="date-selector-card mb-4 shadow-sm">
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-center">
            <Button 
              variant="light" 
              className="date-nav-btn"
              onClick={() => changeDate(-1)}
            >
              <FiChevronLeft />
            </Button>
            
            <div className="date-display text-center">
              <h5 className="mb-0">
                <FiCalendar className="me-2" />
                {formatDate(date)}
              </h5>
              {date.toDateString() === new Date().toDateString() && (
                <span className="badge bg-primary mt-1">Hoy</span>
              )}
            </div>
            
            <Button 
              variant="light" 
              className="date-nav-btn"
              onClick={() => changeDate(1)}
            >
              <FiChevronRight />
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Resumen nutricional y comidas */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando datos nutricionales...</p>
        </div>
      ) : (
        <Row>
          {/* Resumen nutricional */}
          <Col lg={4} className="mb-4">
            <Card className="h-100 nutrition-summary-card shadow-sm">
              <Card.Body className="p-4">
                <h5 className="card-title mb-4">Resumen Nutricional</h5>
                
                <div className="nutrition-summary">
                  <div className="calories-summary text-center mb-4">
                    <div className="calories-circle">
                      <div className="calories-content">
                        <h2>{nutritionSummary.calories.consumed}</h2>
                        <p>kcal</p>
                      </div>
                    </div>
                    <p className="mt-2">
                      de {nutritionSummary.calories.goal} kcal diarias
                    </p>
                    <ProgressBar 
                      now={(nutritionSummary.calories.consumed / nutritionSummary.calories.goal) * 100} 
                      variant="primary" 
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="macros-chart">
                    <h6 className="text-center mb-3">Distribución de Macronutrientes</h6>
                    <div style={{ height: '200px' }}>
                      <Doughnut data={macroChartData} options={chartOptions} />
                    </div>
                  </div>
                  
                  <div className="macros-detail mt-4">
                    <div className="macro-item">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Proteínas</span>
                        <span>{nutritionSummary.protein.consumed}g / {nutritionSummary.protein.goal}g</span>
                      </div>
                      <ProgressBar 
                        now={(nutritionSummary.protein.consumed / nutritionSummary.protein.goal) * 100} 
                        variant="primary" 
                      />
                    </div>
                    
                    <div className="macro-item mt-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Carbohidratos</span>
                        <span>{nutritionSummary.carbs.consumed}g / {nutritionSummary.carbs.goal}g</span>
                      </div>
                      <ProgressBar 
                        now={(nutritionSummary.carbs.consumed / nutritionSummary.carbs.goal) * 100} 
                        variant="info" 
                      />
                    </div>
                    
                    <div className="macro-item mt-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Grasas</span>
                        <span>{nutritionSummary.fat.consumed}g / {nutritionSummary.fat.goal}g</span>
                      </div>
                      <ProgressBar 
                        now={(nutritionSummary.fat.consumed / nutritionSummary.fat.goal) * 100} 
                        variant="warning" 
                      />
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Lista de comidas */}
          <Col lg={8}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title mb-0">Comidas del Día</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditMealId(null);
                      setNewMeal({
                        name: '',
                        time: '08:00',
                        foods: [{ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 }]
                      });
                      setShowModal(true);
                    }}
                  >
                    <FiPlus className="me-1" /> Añadir Comida
                  </Button>
                </div>
                
                {meals.length > 0 ? (
                  <div className="meals-list">
                    {meals.map(meal => (
                      <div key={meal.id} className="meal-item mb-4 p-3 border rounded">
                        <div className="meal-header d-flex justify-content-between align-items-center mb-3">
                          <div className="meal-title">
                            <h5 className="mb-0">{meal.name}</h5>
                            <span className="meal-time">
                              <FiClock className="me-1" />
                              {meal.time}
                            </span>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="meal-calories me-3">
                              <span className="fw-bold">{calculateMealCalories(meal)} kcal</span>
                            </div>
                            <div className="meal-actions">
                              <Button 
                                variant="link" 
                                className="p-0 text-primary me-3"
                                onClick={() => handleEditMeal(meal)}
                              >
                                <FiEdit size={18} />
                              </Button>
                              <Button 
                                variant="link" 
                                className="p-0 text-danger"
                                onClick={() => handleDeleteMeal(meal.id)}
                              >
                                <FiTrash2 size={18} />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="meal-foods">
                          <div className="table-responsive">
                            <table className="table table-sm">
                              <thead className="table-light">
                                <tr>
                                  <th>Alimento</th>
                                  <th className="text-end">Calorías</th>
                                  <th className="text-end">Proteínas</th>
                                  <th className="text-end">Carbos</th>
                                  <th className="text-end">Grasas</th>
                                </tr>
                              </thead>
                              <tbody>
                                {meal.foods.map((food, index) => (
                                  <tr key={index}>
                                    <td>{food.name}</td>
                                    <td className="text-end">{food.calories} kcal</td>
                                    <td className="text-end">{food.protein}g</td>
                                    <td className="text-end">{food.carbs}g</td>
                                    <td className="text-end">{food.fat}g</td>
                                  </tr>
                                ))}
                                <tr className="table-light fw-bold">
                                  <td><strong>Total</strong></td>
                                  <td className="text-end"><strong>{calculateMealCalories(meal)} kcal</strong></td>
                                  <td className="text-end"><strong>{meal.foods.reduce((sum, food) => sum + food.protein, 0)}g</strong></td>
                                  <td className="text-end"><strong>{meal.foods.reduce((sum, food) => sum + food.carbs, 0)}g</strong></td>
                                  <td className="text-end"><strong>{meal.foods.reduce((sum, food) => sum + food.fat, 0)}g</strong></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 empty-state">
                    <div className="empty-icon">
                      <FiActivity />
                    </div>
                    <p className="text-muted">No hay comidas registradas para este día</p>
                    <Button 
                      variant="primary"
                      onClick={() => setShowModal(true)}
                    >
                      <FiPlus className="me-2" /> Añadir primera comida
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {/* Modal para nueva comida o editar comida */}
      <Modal 
        show={showModal} 
        onHide={() => {
          setShowModal(false);
          setIsEditing(false);
          setEditMealId(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Comida' : 'Añadir Nueva Comida'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group controlId="mealName">
                  <Form.Label>Nombre de la comida</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newMeal.name}
                    onChange={handleMealChange}
                    placeholder="Ej: Desayuno, Almuerzo, Cena, Merienda"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="mealTime">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={newMeal.time}
                    onChange={handleMealChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Alimentos</h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={addFood}
              >
                <FiPlus className="me-1" /> Añadir alimento
              </Button>
            </div>
            
            {newMeal.foods.map((food, index) => (
              <div key={index} className="food-item mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Alimento {index + 1}</h6>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeFood(index)}
                    disabled={newMeal.foods.length === 1}
                  >
                    <FiX />
                  </Button>
                </div>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group controlId={`food-name-${index}`}>
                      <Form.Label>Nombre del alimento</Form.Label>
                      <Form.Control
                        type="text"
                        value={food.name}
                        onChange={(e) => handleFoodChange(index, 'name', e.target.value)}
                        placeholder="Ej: Avena con leche"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={3}>
                    <Form.Group controlId={`food-calories-${index}`}>
                      <Form.Label>Calorías</Form.Label>
                      <Form.Control
                        type="number"
                        value={food.calories}
                        onChange={(e) => handleFoodChange(index, 'calories', e.target.value)}
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId={`food-protein-${index}`}>
                      <Form.Label>Proteínas (g)</Form.Label>
                      <Form.Control
                        type="number"
                        value={food.protein}
                        onChange={(e) => handleFoodChange(index, 'protein', e.target.value)}
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId={`food-carbs-${index}`}>
                      <Form.Label>Carbohidratos (g)</Form.Label>
                      <Form.Control
                        type="number"
                        value={food.carbs}
                        onChange={(e) => handleFoodChange(index, 'carbs', e.target.value)}
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId={`food-fat-${index}`}>
                      <Form.Label>Grasas (g)</Form.Label>
                      <Form.Control
                        type="number"
                        value={food.fat}
                        onChange={(e) => handleFoodChange(index, 'fat', e.target.value)}
                        min="0"
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
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowModal(false);
              setIsEditing(false);
              setEditMealId(null);
            }}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveMeal}>
            {isEditing ? 'Actualizar' : 'Guardar'} Comida
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Nutrition; 