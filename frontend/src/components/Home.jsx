import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaChartLine, FaBullseye, FaDumbbell, FaAppleAlt, FaHeartbeat } from 'react-icons/fa';

function Home() {
    return (
        <div className="home-page">
            <div className="hero-section text-center py-5">
                <h1 className="display-4 mb-4">Welcome to HealthTracker</h1>
                <p className="lead mb-4">Track your fitness journey and achieve your health goals</p>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/register">
                        <Button variant="primary" size="lg">Get Started</Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="light" className='text-dark border-0' size="lg">Login</Button>
                    </Link>
                </div>
            </div>

            <Container className="features-section py-5">
                <h2 className="text-center mb-5">Features</h2>
                <Row className="g-4">
                    <Col md={4}>
                        <Card className="h-100 feature-card">
                            <Card.Body className="text-center">
                                <FaChartLine className="feature-icon mb-3" />
                                <Card.Title>Dashboard</Card.Title>
                                <Card.Text>
                                    Monitor your progress with detailed statistics and visualizations
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 feature-card">
                            <Card.Body className="text-center">
                                <FaBullseye className="feature-icon mb-3" />
                                <Card.Title>Goals</Card.Title>
                                <Card.Text>
                                    Set and track your fitness goals with progress monitoring
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 feature-card">
                            <Card.Body className="text-center">
                                <FaDumbbell className="feature-icon mb-3" />
                                <Card.Title>Workouts</Card.Title>
                                <Card.Text>
                                    Log and track your workout sessions and progress
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 feature-card">
                            <Card.Body className="text-center">
                                <FaAppleAlt className="feature-icon mb-3" />
                                <Card.Title>Nutrition</Card.Title>
                                <Card.Text>
                                    Track your daily nutrition and maintain a balanced diet
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 feature-card">
                            <Card.Body className="text-center">
                                <FaHeartbeat className="feature-icon mb-3" />
                                <Card.Title>Health Metrics</Card.Title>
                                <Card.Text>
                                    Monitor vital health metrics like heart rate and sleep
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home; 