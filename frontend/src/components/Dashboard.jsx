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
import { FaWalking, FaWater, FaFire, FaHeartbeat, FaBed, FaLungs, FaSync, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

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
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Activity Level',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.4
    }]
  });

  const [nutritionData, setNutritionData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Calories Consumed',
      data: [1800, 2100, 1900, 2200, 2000, 2300, 1700],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.4
    }]
  });

  const [goals, setGoals] = useState([]);

  const [recommendations, setRecommendations] = useState([]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    fetchDashboardData();
    fetchUserProfile();
    fetchLatestMetrics();
    generateRecommendations();
    
    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
      fetchUserProfile();
      fetchLatestMetrics();
      generateRecommendations();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/users/profile', {
        headers: {
          'Authorization': Bearer ${token}
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

  const generateRecommendations = () => {
    const newRecommendations = [];
    
    // Water intake recommendation
    if (healthMetrics.water < 2) {
      newRecommendations.push({
        type: 'warning',
        message: 'Your water intake is below recommended levels. Try to drink at least 2L of water daily.',
        icon: <FaExclamationTriangle className="text-warning" />
      });
    } else if (healthMetrics.water > 4) {
      newRecommendations.push({
        type: 'warning',
        message: 'Your water intake is above recommended levels. Drinking more than 4L daily can be harmful. Consider reducing your intake.',
        icon: <FaExclamationTriangle className="text-warning" />
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: 'Great job on maintaining good water intake!',
        icon: <FaCheckCircle className="text-success" />
      });
    }

    // Sleep recommendation
    if (healthMetrics.sleep < 7) {
      newRecommendations.push({
        type: 'warning',
        message: 'You need more sleep. Aim for 7-9 hours of sleep per night.',
        icon: <FaExclamationTriangle className="text-warning" />
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: 'Good sleep duration! Keep it up.',
        icon: <FaCheckCircle className="text-success" />
      });
    }

    // Activity level recommendation
    const avgActivity = workoutData.datasets[0].data.reduce((a, b) => a + b, 0) / workoutData.datasets[0].data.length;
    if (avgActivity < 50) {
      newRecommendations.push({
        type: 'warning',
        message: 'Your activity level is low. Try to increase your daily physical activity.',
        icon: <FaExclamationTriangle className="text-warning" />
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: 'Excellent activity level! You\'re maintaining good physical fitness.',
        icon: <FaCheckCircle className="text-success" />
      });
    }

    // Calorie intake recommendation
    const avgCalories = nutritionData.datasets[0].data.reduce((a, b) => a + b, 0) / nutritionData.datasets[0].data.length;
    if (avgCalories > 2500) {
      newRecommendations.push({
        type: 'warning',
        message: 'Your calorie intake is high. Consider reducing portion sizes.',
        icon: <FaExclamationTriangle className="text-warning" />
      });
    } else if (avgCalories < 1500) {
      newRecommendations.push({
        type: 'warning',
        message: 'Your calorie intake is low. Make sure you\'re eating enough to maintain energy levels.',
        icon: <FaExclamationTriangle className="text-warning" />
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: 'Your calorie intake is within the recommended range.',
        icon: <FaCheckCircle className="text-success" />
      });
    }

    setRecommendations(newRecommendations);
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="text-muted mb-1">{getGreeting()}</h4>
              <h2 className="mb-0">Welcome Back 👋</h2>
            </div>
            <div className="d-flex align-items-center">
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

      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Workout Activity</h5>
            </Card.Header>
            <Card.Body>
              <Line
                data={workoutData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Weekly Activity Level'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Activity Level'
                      }
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-danger text-white">
              <h5 className="mb-0">Nutrition Tracking</h5>
            </Card.Header>
            <Card.Body>
              <Line
                data={nutritionData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Weekly Calorie Intake'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Calories'
                      }
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Health Recommendations</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {recommendations.map((rec, index) => (
                  <Col md={6} key={index} className="mb-3">
                    <div className={`d-flex align-items-center p-3 rounded ${rec.type === 'warning' ? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'}`}>
                      <div className="me-3">
                        {rec.icon}
                      </div>
                      <div>
                        <p className="mb-0">{rec.message}</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
