import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaChartLine, FaBullseye, FaDumbbell, FaAppleAlt, FaHeartbeat, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

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

            {/* Footer Section */}
            <footer className="py-4 mt-4" style={{ background: 'linear-gradient(135deg, #007bff 0%, #00b4db 100%)' }}>
                <Container>
                    <Row className="g-4">
                        <Col md={4}>
                            <h5 className="mb-3 text-white">About HealthTracker</h5>
                            <p className="text-white-50" style={{ fontSize: '1rem' }}>
                                HealthTracker is your comprehensive health and fitness companion. 
                                We help you monitor your health metrics, track your workouts, 
                                manage your nutrition, and achieve your fitness goals.
                            </p>
                        </Col>
                        <Col md={4}>
                            <h5 className="mb-3 text-white">Contact Us</h5>
                            <ul className="list-unstyled" style={{ fontSize: '1rem' }}>
                                <li className="mb-3">
                                    <FaEnvelope className="me-2 text-white" />
                                    <a href="mailto:support@healthtracker.com" className="text-white-50 text-decoration-none">
                                        support@healthtracker.com
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <FaPhone className="me-2 text-white" />
                                    <a href="tel:+1234567890" className="text-white-50 text-decoration-none">
                                        +1 (234) 567-890
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <FaMapMarkerAlt className="me-2 text-white" />
                                    <span className="text-white-50">
                                        123 Health Street, Fitness City, FC 12345
                                    </span>
                                </li>
                            </ul>
                        </Col>
                        <Col md={4}>
                            <h5 className="mb-3 text-white">Connect With Us</h5>
                            <div className="d-flex gap-4 mb-3">
                                <a href="#" className="text-white-50 fs-4">
                                    <FaFacebook />
                                </a>
                                <a href="#" className="text-white-50 fs-4">
                                    <FaTwitter />
                                </a>
                                <a href="#" className="text-white-50 fs-4">
                                    <FaInstagram />
                                </a>
                                <a href="#" className="text-white-50 fs-4">
                                    <FaLinkedin />
                                </a>
                            </div>
                            <h5 className="mb-3 text-white">Important Links</h5>
                            <ul className="list-unstyled" style={{ fontSize: '1rem' }}>
                                <li className="mb-2">
                                    <Link to="/privacy" className="text-white-50 text-decoration-none">Privacy Policy</Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/terms" className="text-white-50 text-decoration-none">Terms of Service</Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/faq" className="text-white-50 text-decoration-none">FAQ</Link>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    <hr className="my-3 border-light" />
                    <Row>
                        <Col className="text-center">
                            <p className="text-white-50 mb-0" style={{ fontSize: '1rem' }}>
                                © {new Date().getFullYear()} HealthTracker. All rights reserved.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
}

export default Home;
