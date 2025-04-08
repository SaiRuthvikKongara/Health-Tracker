import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FaWalking, FaWater, FaFire, FaHeartbeat, FaBed, FaLungs, FaSync } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [userData, setUserData] = useState({
    name: '',
    location: '',
    weight: 0,
    height: 0,
    age: 0
  });
  
  const [healthMetrics, setHealthMetrics] = useState({
    water: 0,
    sleep: 0,
    heartRate: 0,
    oxygenLevel: 0
  });

  const [workoutData, setWorkoutData] = useState({
    labels: [],
    datasets: [{
      label: 'Activity',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.4
    }]
  });

  const [nutritionData, setNutritionData] = useState({
    labels: [],
    datasets: [{
      label: 'Calories',
      data: [],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.4
    }]
  });

  const [goals, setGoals] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchUserProfile();
    fetchLatestMetrics();
    
    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
      fetchUserProfile();
      fetchLatestMetrics();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchUserProfile(),
        fetchLatestMetrics()
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchLatestMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/health-metrics/latest', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setHealthMetrics(response.data || {
        water: 0,
        sleep: 0,
        heartRate: 0,
        oxygenLevel: 0
      });
    } catch (error) {
      console.error('Error fetching latest metrics:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = response.data || { workouts: [], nutrition: [], goals: [] };
      
      // Process workout data
      const workoutLabels = data.workouts?.map(w => new Date(w.date).toLocaleDateString()) || [];
      const workoutCalories = data.workouts?.map(w => w.caloriesBurned) || [];
      
      setWorkoutData({
        labels: workoutLabels,
        datasets: [{
          label: 'Calories Burned',
          data: workoutCalories,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.4
        }]
      });

      // Process nutrition data
      const nutritionLabels = data.nutrition?.map(n => new Date(n.date).toLocaleDateString()) || [];
      const nutritionCalories = data.nutrition?.map(n => n.calories) || [];
      
      setNutritionData({
        labels: nutritionLabels,
        datasets: [{
          label: 'Calories Consumed',
          data: nutritionCalories,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.4
        }]
      });

      // Process goals
      const goalsData = Array.isArray(data.goals) ? data.goals : [];
      setGoals(goalsData.map(goal => ({
        ...goal,
        progress: Math.round((goal.currentValue / goal.targetValue) * 100)
      })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setGoals([]); // Ensure goals is an empty array on error
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="text-muted mb-1">Good Morning</h4>
              <h2 className="mb-0">Welcome Back 👋</h2>
            </div>
            <div className="d-flex align-items-center">
              <Button 
                variant="outline-primary" 
                className="me-3"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <FaSync className={isRefreshing ? 'fa-spin' : ''} /> Refresh
              </Button>
              <div className="text-end">
                <div className="d-flex align-items-center">
                  <div className="me-4">
                    <span className="text-muted">Weight</span>
                    <h4 className="mb-0">{userData.weight} kg</h4>
                  </div>
                  <div className="me-4">
                    <span className="text-muted">Height</span>
                    <h4 className="mb-0">{userData.height} ft</h4>
                  </div>
                  <div>
                    <span className="text-muted">Age</span>
                    <h4 className="mb-0">{userData.age} yrs</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={2}>
          <Card className="h-100 bg-info bg-opacity-10 border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaWater className="text-info me-2" size={24} />
                <h6 className="mb-0">Water</h6>
              </div>
              <h3 className="mb-2">{healthMetrics.water}L</h3>
              <p className="text-muted mb-0">Daily intake</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="h-100 bg-warning bg-opacity-10 border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaBed className="text-warning me-2" size={24} />
                <h6 className="mb-0">Sleep</h6>
              </div>
              <h3 className="mb-2">{healthMetrics.sleep}hrs</h3>
              <p className="text-muted mb-0">Last night</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="h-100 bg-danger bg-opacity-10 border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaFire className="text-danger me-2" size={24} />
                <h6 className="mb-0">Calories</h6>
              </div>
              <h3 className="mb-2">{workoutData.datasets[0].data[0] || 0}</h3>
              <p className="text-muted mb-0">Burned today</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="h-100 bg-primary bg-opacity-10 border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaHeartbeat className="text-primary me-2" size={24} />
                <h6 className="mb-0">Heart Rate</h6>
              </div>
              <h3 className="mb-2">{healthMetrics.heartRate} bpm</h3>
              <p className="text-muted mb-0">Current</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="h-100 bg-success bg-opacity-10 border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaLungs className="text-success me-2" size={24} />
                <h6 className="mb-0">Oxygen</h6>
              </div>
              <h3 className="mb-2">{healthMetrics.oxygenLevel}%</h3>
              <p className="text-muted mb-0">SpO2 Level</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Row className="mb-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Workout Activity</h5>
                    <select className="form-select form-select-sm w-auto">
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <Line 
                    data={workoutData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Nutrition Tracking</h5>
                    <select className="form-select form-select-sm w-auto">
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <Line 
                    data={nutritionData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5 className="mb-4">Your Goals</h5>
              {Array.isArray(goals) && goals.length > 0 ? (
                goals.map(goal => (
                  <div key={goal.id} className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{goal.description}</h6>
                        <div className="progress" style={{ height: '6px' }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ 
                              width: `${goal.progress}%`,
                              backgroundColor: goal.progress >= 100 ? '#28a745' : '#007bff'
                            }}
                          />
                        </div>
                      </div>
                      <span className="ms-3 text-primary">{goal.progress}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">No goals set yet</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 