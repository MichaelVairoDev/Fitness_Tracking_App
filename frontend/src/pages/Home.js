import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaAppleAlt, FaChartLine, FaRunning, FaHeartbeat, FaUsers } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="hero-content">
              <h1>Tu camino hacia un estilo de vida más saludable</h1>
              <p>
                FitnessTrack te ayuda a alcanzar tus objetivos de fitness con seguimiento personalizado 
                de entrenamientos, nutrición y progreso. Todo en una sola aplicación.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn btn-primary me-3">Comenzar ahora</Link>
                <Link to="/login" className="btn btn-outline">Iniciar sesión</Link>
              </div>
            </Col>
            <Col lg={6} className="hero-image">
              <img 
                src="/images/fitness-hero.png" 
                alt="Persona haciendo ejercicio" 
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features">
        <Container>
          <h2>Características principales</h2>
          <div className="features-grid">
            <Card className="feature-card">
              <div className="feature-icon">
                <FaDumbbell />
              </div>
              <h3>Seguimiento de entrenamientos</h3>
              <p>Registra tus entrenamientos, establece rutinas personalizadas y mantén un historial completo de tu actividad física.</p>
            </Card>

            <Card className="feature-card">
              <div className="feature-icon">
                <FaAppleAlt />
              </div>
              <h3>Control nutricional</h3>
              <p>Registra tus comidas diarias, controla la ingesta de calorías y mantén un equilibrio en tus macronutrientes.</p>
            </Card>

            <Card className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>Análisis de progreso</h3>
              <p>Visualiza tu progreso con gráficos detallados y estadísticas que te ayudarán a mantenerte motivado.</p>
            </Card>

            <Card className="feature-card">
              <div className="feature-icon">
                <FaHeartbeat />
              </div>
              <h3>Objetivos personalizados</h3>
              <p>Establece metas realistas y recibe recomendaciones personalizadas para alcanzarlas de manera efectiva.</p>
            </Card>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <Container>
          <h2>¿Cómo funciona?</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Regístrate</h3>
              <p>Crea tu cuenta gratuita y configura tu perfil con tus datos básicos y objetivos de fitness.</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Planifica</h3>
              <p>Establece tus rutinas de entrenamiento y planifica tu alimentación según tus objetivos.</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Registra</h3>
              <p>Registra tus entrenamientos y comidas diarias de forma rápida y sencilla.</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Analiza</h3>
              <p>Visualiza tu progreso y ajusta tus planes según los resultados obtenidos.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <Container>
          <h2>Lo que dicen nuestros usuarios</h2>
          <Row className="mt-4">
            <Col md={4} className="mb-4">
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="testimonial-content">
                    <p>"FitnessTrack ha transformado mi rutina de ejercicios. Ahora puedo ver mi progreso claramente y me mantiene motivado."</p>
                    <div className="testimonial-author">
                      <h5>Carlos Rodríguez</h5>
                      <p>Usuario desde hace 6 meses</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="testimonial-content">
                    <p>"La función de seguimiento nutricional es increíble. He logrado mejorar mis hábitos alimenticios y alcanzar mis objetivos."</p>
                    <div className="testimonial-author">
                      <h5>Laura Martínez</h5>
                      <p>Usuario desde hace 1 año</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="testimonial-content">
                    <p>"La interfaz es muy intuitiva y fácil de usar. Recomiendo FitnessTrack a todos mis amigos que quieren mejorar su condición física."</p>
                    <div className="testimonial-author">
                      <h5>Miguel Sánchez</h5>
                      <p>Usuario desde hace 3 meses</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <Container>
          <h2>¿Listo para comenzar tu transformación?</h2>
          <p>Únete a miles de personas que ya están mejorando su salud y condición física con FitnessTrack.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Crear cuenta gratis</Link>
        </Container>
      </section>
    </div>
  );
};

export default Home; 