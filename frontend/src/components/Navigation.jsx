import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaChartLine, FaBullseye, FaDumbbell, FaAppleAlt, FaHeartbeat, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">HealthTracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                  <FaChartLine className="me-1" /> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/goals" className={location.pathname === '/goals' ? 'active' : ''}>
                  <FaBullseye className="me-1" /> Goals
                </Nav.Link>
                <Nav.Link as={Link} to="/workouts" className={location.pathname === '/workouts' ? 'active' : ''}>
                  <FaDumbbell className="me-1" /> Workouts
                </Nav.Link>
                <Nav.Link as={Link} to="/nutrition" className={location.pathname === '/nutrition' ? 'active' : ''}>
                  <FaAppleAlt className="me-1" /> Nutrition
                </Nav.Link>
                <Nav.Link as={Link} to="/health-metrics" className={location.pathname === '/health-metrics' ? 'active' : ''}>
                  <FaHeartbeat className="me-1" /> Health Metrics
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
                  <FaUser className="me-1" /> Profile
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active' : ''}>
                <FaHome className="me-1" /> Home
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {user ? (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className={location.pathname === '/register' ? 'active' : ''}>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation; 
