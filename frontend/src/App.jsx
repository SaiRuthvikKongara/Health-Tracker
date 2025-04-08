import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import NutritionTracker from './components/NutritionTracker';
import Goals from './components/Goals';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app">
            <Header />
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
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
                  path="/goals"
                  element={
                    <PrivateRoute>
                      <Goals />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Container>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 