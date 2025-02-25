import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Tabs, Tab } from 'react-bootstrap';
import { 
  FiActivity, FiBarChart2, FiTrendingUp, FiCalendar, 
  FiPieChart, FiTarget, FiAward, FiArrowUp, FiArrowDown 
} from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Progress.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Generar datos de ejemplo para diferentes rangos de tiempo
const generateTimeRangeData = (range) => {
  const now = new Date();
  let labels = [];
  let weightData = [];
  let workoutsData = [];
  let caloriesData = [];
  let strengthBenchData = [];
  let strengthSquatData = [];
  
  switch(range) {
    case 'week':
      // Última semana (7 días)
      labels = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 6 + i);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      });
      weightData = [78.5, 78.3, 78.3, 78.0, 77.8, 77.8, 77.5];
      workoutsData = [1, 0, 1, 0, 1, 0, 1];
      caloriesData = [350, 0, 400, 0, 380, 0, 420];
      strengthBenchData = [70, 70, 70, 70, 72.5, 72.5, 72.5];
      strengthSquatData = [95, 95, 95, 95, 100, 100, 100];
      break;
      
    case 'month':
      // Último mes (4 semanas)
      labels = Array.from({length: 4}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 21 + (i * 7));
        return `Semana ${i+1}`;
      });
      weightData = [80, 79.2, 78.4, 77.5];
      workoutsData = [3, 4, 3, 4];
      caloriesData = [1200, 1450, 1100, 1350];
      strengthBenchData = [67.5, 67.5, 70, 72.5];
      strengthSquatData = [90, 92.5, 95, 100];
      break;
      
    case 'quarter':
      // Últimos 3 meses (12 semanas)
      labels = Array.from({length: 3}, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - 2 + i);
        return date.toLocaleDateString('es-ES', { month: 'long' });
      });
      weightData = [82, 79.5, 77.5];
      workoutsData = [12, 14, 14];
      caloriesData = [4200, 4800, 5100];
      strengthBenchData = [60, 65, 72.5];
      strengthSquatData = [85, 92.5, 100];
      break;
      
    case 'year':
      // Último año (12 meses)
      labels = Array.from({length: 6}, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - 5 + i);
        return date.toLocaleDateString('es-ES', { month: 'short' });
      });
      weightData = [85, 84, 82, 80, 78.5, 77.5];
      workoutsData = [8, 10, 12, 14, 12, 14];
      caloriesData = [3600, 4000, 4400, 4800, 4200, 5100];
      strengthBenchData = [50, 55, 60, 65, 70, 72.5];
      strengthSquatData = [75, 80, 85, 90, 95, 100];
      break;
      
    default:
      return {};
  }
  
  return {
    weight: {
      labels,
      datasets: [
        {
          label: 'Peso (kg)',
          data: weightData,
          borderColor: '#4361ee',
          backgroundColor: 'rgba(67, 97, 238, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#4361ee',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    workouts: {
      labels,
      datasets: [
        {
          label: 'Entrenamientos',
          data: workoutsData,
          backgroundColor: 'rgba(58, 12, 163, 0.8)',
          borderRadius: 6,
          maxBarThickness: 40
        }
      ]
    },
    calories: {
      labels,
      datasets: [
        {
          label: 'Calorías quemadas',
          data: caloriesData,
          borderColor: '#7209b7',
          backgroundColor: 'rgba(114, 9, 183, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#7209b7',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    strength: {
      labels,
      datasets: [
        {
          label: 'Press de banca (kg)',
          data: strengthBenchData,
          borderColor: '#f72585',
          backgroundColor: 'rgba(247, 37, 133, 0.1)',
          tension: 0.4,
          fill: false,
          pointBackgroundColor: '#f72585',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Sentadilla (kg)',
          data: strengthSquatData,
          borderColor: '#4cc9f0',
          backgroundColor: 'rgba(76, 201, 240, 0.1)',
          tension: 0.4,
          fill: false,
          pointBackgroundColor: '#4cc9f0',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    }
  };
};

const Progress = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Cargar datos según el rango de tiempo seleccionado
  useEffect(() => {
    setLoading(true);
    
    // Simular carga de datos desde una API
    setTimeout(() => {
      const mockData = generateTimeRangeData(timeRange);
      setProgressData(mockData);
      setLoading(false);
    }, 500);
  }, [timeRange]);
  
  // Estadísticas de progreso según el rango de tiempo
  const getProgressStats = () => {
    switch(timeRange) {
      case 'week':
        return [
          { title: 'Peso', value: '-1.0 kg', change: '-1.3%', trend: 'down', icon: <FiActivity /> },
          { title: 'Entrenamientos', value: '4', change: '+33%', trend: 'up', icon: <FiBarChart2 /> },
          { title: 'Calorías', value: '1,550', change: '+20%', trend: 'up', icon: <FiPieChart /> },
          { title: 'Fuerza', value: '+2.5 kg', change: '+3.3%', trend: 'up', icon: <FiTrendingUp /> }
        ];
      case 'month':
        return [
          { title: 'Peso', value: '-2.5 kg', change: '-3.1%', trend: 'down', icon: <FiActivity /> },
          { title: 'Entrenamientos', value: '14', change: '+40%', trend: 'up', icon: <FiBarChart2 /> },
          { title: 'Calorías', value: '5,100', change: '+30%', trend: 'up', icon: <FiPieChart /> },
          { title: 'Fuerza', value: '+5.0 kg', change: '+7.4%', trend: 'up', icon: <FiTrendingUp /> }
        ];
      case 'quarter':
        return [
          { title: 'Peso', value: '-4.5 kg', change: '-5.5%', trend: 'down', icon: <FiActivity /> },
          { title: 'Entrenamientos', value: '40', change: '+48%', trend: 'up', icon: <FiBarChart2 /> },
          { title: 'Calorías', value: '14,100', change: '+35%', trend: 'up', icon: <FiPieChart /> },
          { title: 'Fuerza', value: '+12.5 kg', change: '+20.8%', trend: 'up', icon: <FiTrendingUp /> }
        ];
      case 'year':
        return [
          { title: 'Peso', value: '-7.5 kg', change: '-8.8%', trend: 'down', icon: <FiActivity /> },
          { title: 'Entrenamientos', value: '60', change: '+57%', trend: 'up', icon: <FiBarChart2 /> },
          { title: 'Calorías', value: '22,100', change: '+42%', trend: 'up', icon: <FiPieChart /> },
          { title: 'Fuerza', value: '+22.5 kg', change: '+45%', trend: 'up', icon: <FiTrendingUp /> }
        ];
      default:
        return [];
    }
  };
  
  // Obtener estadísticas de acuerdo al rango seleccionado
  const progressStats = getProgressStats();
  
  // Opciones para los gráficos de línea
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        bodyFont: {
          size: 13
        },
        titleFont: {
          size: 14,
          weight: 'bold'
        }
      }
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
    elements: {
      line: {
        borderWidth: 3
      }
    }
  };
  
  // Opciones para los gráficos de barras
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        bodyFont: {
          size: 13
        },
        titleFont: {
          size: 14,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };
  
  // Cambiar rango de tiempo
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  return (
    <Container className="progress-container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title">Mi Progreso</h1>
          <p className="text-muted">Seguimiento de tus resultados y evolución</p>
        </div>
        <Form.Select 
          className="time-range-select" 
          value={timeRange}
          onChange={handleTimeRangeChange}
          style={{ width: '200px' }}
        >
          <option value="week">Última semana</option>
          <option value="month">Último mes</option>
          <option value="quarter">Últimos 3 meses</option>
          <option value="year">Último año</option>
        </Form.Select>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <Row className="mb-4">
        {progressStats.map((stat, index) => (
          <Col md={3} sm={6} className="mb-3 mb-md-0" key={index}>
            <Card className="stat-card shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-2">
                  <div className="stat-icon">
                    {stat.icon}
                  </div>
                  <h6 className="mb-0">{stat.title}</h6>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                  {stat.trend === 'up' ? <FiArrowUp /> : <FiArrowDown />} {stat.change}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* Gráficos de progreso */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando datos de progreso...</p>
        </div>
      ) : (
        <Tabs defaultActiveKey="weight" className="mb-4 progress-tabs">
          <Tab eventKey="weight" title={<><FiActivity className="me-2" /> Peso</>}>
            <Card className="chart-card shadow-sm">
              <Card.Body className="p-4">
                <h5 className="card-title mb-4">Progreso de Peso</h5>
                <div className="chart-container" style={{ height: '350px' }}>
                  <Line data={progressData.weight} options={lineOptions} />
                </div>
                <div className="chart-summary mt-4">
                  <Row>
                    <Col md={4} className="text-center">
                      <div className="summary-label">Peso inicial</div>
                      <div className="summary-value">
                        {timeRange === 'week' ? '78.5' : 
                         timeRange === 'month' ? '80' : 
                         timeRange === 'quarter' ? '82' : '85'} kg
                      </div>
                    </Col>
                    <Col md={4} className="text-center">
                      <div className="summary-label">Peso actual</div>
                      <div className="summary-value">77.5 kg</div>
                    </Col>
                    <Col md={4} className="text-center">
                      <div className="summary-label">Cambio</div>
                      <div className="summary-value text-success">
                        {timeRange === 'week' ? '-1.0 kg (-1.3%)' : 
                         timeRange === 'month' ? '-2.5 kg (-3.1%)' : 
                         timeRange === 'quarter' ? '-4.5 kg (-5.5%)' : '-7.5 kg (-8.8%)'}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="workouts" title={<><FiBarChart2 className="me-2" /> Entrenamientos</>}>
            <Card className="chart-card shadow-sm">
              <Card.Body className="p-4">
                <h5 className="card-title mb-4">Frecuencia de Entrenamientos</h5>
                <div className="chart-container" style={{ height: '350px' }}>
                  <Bar data={progressData.workouts} options={barOptions} />
                </div>
                <div className="chart-summary mt-4">
                  <Row>
                    <Col md={4} className="text-center">
                      <div className="summary-label">Total entrenamientos</div>
                      <div className="summary-value">
                        {timeRange === 'week' ? '4' : 
                         timeRange === 'month' ? '14' : 
                         timeRange === 'quarter' ? '40' : '60'}
                      </div>
                    </Col>
                    <Col md={4} className="text-center">
                      <div className="summary-label">Promedio semanal</div>
                      <div className="summary-value">
                        {timeRange === 'week' ? '4.0' : 
                         timeRange === 'month' ? '3.5' : 
                         timeRange === 'quarter' ? '3.3' : '3.2'}
                      </div>
                    </Col>
                    <Col md={4} className="text-center">
                      <div className="summary-label">Mejor semana</div>
                      <div className="summary-value">
                        {timeRange === 'week' ? '4' : '5'} entrenamientos
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="calories" title={<><FiPieChart className="me-2" /> Calorías</>}>
            <Card className="chart-card shadow-sm">
              <Card.Body className="p-4">
                <h5 className="card-title mb-4">Calorías Quemadas</h5>
                <div className="chart-container" style={{ height: '350px' }}>
                  <Line data={progressData.calories} options={lineOptions} />
                </div>
                <div className="chart-summary mt-4">
                  <Row>
                    <Col md={4} className="text-center">
                      <div className="summary-label">Total calorías</div>
                      <div className="summary-value">
                        {timeRange === 'week' ? '1,550' : 
                         timeRange === 'month' ? '5,100' : 
                         timeRange === 'quarter' ? '14,100' : '22,100'} kcal
                      </div>
                    </Col>
                    <Col md={4} className="text-center">
                      <div className="summary-label">Promedio semanal</div>
                      <div className="summary-value">
                        {timeRange === 'week' ? '1,550' : 
                         timeRange === 'month' ? '1,275' : 
                         timeRange === 'quarter' ? '1,175' : '1,180'} kcal
                      </div>
                    </Col>
                    <Col md={4} className="text-center">
                      <div className="summary-label">Mejor día/semana</div>
                      <div className="summary-value">
                        {timeRange === 'week' ? '420 kcal' : 
                         timeRange === 'month' ? '1,450 kcal' : 
                         timeRange === 'quarter' ? '5,100 kcal' : '5,100 kcal'}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="strength" title={<><FiTrendingUp className="me-2" /> Fuerza</>}>
            <Card className="chart-card shadow-sm">
              <Card.Body className="p-4">
                <h5 className="card-title mb-4">Progreso de Fuerza</h5>
                <div className="chart-container" style={{ height: '350px' }}>
                  <Line data={progressData.strength} options={lineOptions} />
                </div>
                <div className="chart-summary mt-4">
                  <Row>
                    <Col md={6} className="text-center">
                      <div className="summary-label">Press de banca</div>
                      <div className="summary-value text-success">
                        {timeRange === 'week' ? '+2.5 kg (+3.3%)' : 
                         timeRange === 'month' ? '+5.0 kg (+7.4%)' : 
                         timeRange === 'quarter' ? '+12.5 kg (+20.8%)' : '+22.5 kg (+45%)'}
                      </div>
                    </Col>
                    <Col md={6} className="text-center">
                      <div className="summary-label">Sentadilla</div>
                      <div className="summary-value text-success">
                        {timeRange === 'week' ? '+5.0 kg (+5.3%)' : 
                         timeRange === 'month' ? '+10.0 kg (+11.1%)' : 
                         timeRange === 'quarter' ? '+15.0 kg (+17.6%)' : '+25.0 kg (+33.3%)'}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      )}
      
      {/* Logros y objetivos */}
      <Row className="mt-4">
        <Col md={6} className="mb-4 mb-md-0">
          <Card className="h-100 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="card-title mb-4">
                <FiAward className="me-2" /> Logros Recientes
              </h5>
              <div className="achievements-list">
                <div className="achievement-item p-3 mb-3 rounded border-start border-4 border-warning shadow-sm">
                  <div className="achievement-icon achievement-icon-gold">
                    <FiAward />
                  </div>
                  <div className="achievement-content">
                    <h6>Constancia de Hierro</h6>
                    <p>Completaste 5 entrenamientos en una semana</p>
                    <small className="text-muted">Hace 1 semana</small>
                  </div>
                </div>
                
                <div className="achievement-item p-3 mb-3 rounded border-start border-4 border-secondary shadow-sm">
                  <div className="achievement-icon achievement-icon-silver">
                    <FiTrendingUp />
                  </div>
                  <div className="achievement-content">
                    <h6>Superación Personal</h6>
                    <p>Aumentaste tu peso en press de banca a 70kg</p>
                    <small className="text-muted">Hace 2 semanas</small>
                  </div>
                </div>
                
                <div className="achievement-item p-3 rounded border-start border-4 border-danger shadow-sm">
                  <div className="achievement-icon achievement-icon-bronze">
                    <FiActivity />
                  </div>
                  <div className="achievement-content">
                    <h6>Primer Hito</h6>
                    <p>Perdiste tus primeros 3kg</p>
                    <small className="text-muted">Hace 3 semanas</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="card-title mb-4">
                <FiTarget className="me-2" /> Próximos Objetivos
              </h5>
              <div className="goals-list">
                <div className="goal-item p-3 mb-3 rounded shadow-sm">
                  <div className="goal-icon">
                    <FiActivity />
                  </div>
                  <div className="goal-content">
                    <div className="d-flex justify-content-between mb-2">
                      <h6 className="mb-0">Alcanzar 75kg</h6>
                      <span className="badge bg-primary">77.5kg / 75kg</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                        role="progressbar" 
                        style={{ width: '75%', borderRadius: '5px' }} 
                        aria-valuenow="75" 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <small className="text-muted mt-2 d-block">2.5kg restantes (75% completado)</small>
                  </div>
                </div>
                
                <div className="goal-item p-3 mb-3 rounded shadow-sm">
                  <div className="goal-icon">
                    <FiBarChart2 />
                  </div>
                  <div className="goal-content">
                    <div className="d-flex justify-content-between mb-2">
                      <h6 className="mb-0">Entrenar 20 días en un mes</h6>
                      <span className="badge bg-info">12 / 20</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated bg-info" 
                        role="progressbar" 
                        style={{ width: '60%', borderRadius: '5px' }} 
                        aria-valuenow="60" 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <small className="text-muted mt-2 d-block">8 días restantes (60% completado)</small>
                  </div>
                </div>
                
                <div className="goal-item p-3 rounded shadow-sm">
                  <div className="goal-icon">
                    <FiTrendingUp />
                  </div>
                  <div className="goal-content">
                    <div className="d-flex justify-content-between mb-2">
                      <h6 className="mb-0">Sentadilla 120kg</h6>
                      <span className="badge bg-success">100kg / 120kg</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                        role="progressbar" 
                        style={{ width: '83%', borderRadius: '5px' }} 
                        aria-valuenow="83" 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <small className="text-muted mt-2 d-block">20kg restantes (83% completado)</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Progress; 