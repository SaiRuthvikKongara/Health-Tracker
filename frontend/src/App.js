import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Goals from './components/Goals';
import WorkoutTracker from './components/WorkoutTracker';
import NutritionTracker from './components/NutritionTracker';
import HealthMetrics from './components/HealthMetrics';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Home from './components/Home';
import { Container } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Navigation />
          <Container fluid className="p-0">
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/goals"
                  element={
                    <PrivateRoute>
                      <Goals />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/workouts"
                  element={
                    <PrivateRoute>
                      <WorkoutTracker />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/nutrition"
                  element={
                    <PrivateRoute>
                      <NutritionTracker />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/health-metrics"
                  element={
                    <PrivateRoute>
                      <HealthMetrics />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 