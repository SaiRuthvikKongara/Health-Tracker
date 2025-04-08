import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';
import { logoImage } from '../assets/images';

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg={isDarkMode ? 'dark' : 'light'} variant={isDarkMode ? 'dark' : 'light'} expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logoImage}
            alt="Health Tracker"
            style={{ height: '40px', width: 'auto', marginRight: '10px' }}
          />
          Health Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/workouts">Workouts</Nav.Link>
                <Nav.Link as={Link} to="/nutrition">Nutrition</Nav.Link>
                <Nav.Link as={Link} to="/goals">Goals</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
          <div className="d-flex align-items-center">
            <Button
              variant={isDarkMode ? 'outline-light' : 'outline-dark'}
              onClick={toggleTheme}
              className="me-2"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </Button>
            {user && (
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 