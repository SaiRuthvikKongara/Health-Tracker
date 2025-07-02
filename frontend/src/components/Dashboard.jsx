import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
//import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { FaDumbbell, FaUtensils, FaHeartbeat, FaTint, FaBed, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [workoutData, setWorkoutData] = useState([]);
  const [nutritionData, setNutritionData] = useState([]);
  const [goals, setGoals] = useState([]);
<<<<<<< HEAD

=======
>>>>>>> sai_task
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyWaterIntake, setWeeklyWaterIntake] = useState('0');
  const [weeklyWorkoutStats, setWeeklyWorkoutStats] = useState({ totalWorkouts: 0, totalCalories: 0 });
  const [healthScore, setHealthScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [nextWorkout, setNextWorkout] = useState(null);
  const [mood, setMood] = useState('neutral');
  const [weeklyGoals, setWeeklyGoals] = useState({
    water: 0,
    workouts: 0,
    sleep: 0
  });

  const [healthTips, setHealthTips] = useState([
    // Hydration Tips
    "Stay hydrated! Aim for 8 glasses of water daily.",
    "Drink water 30 minutes before meals for better digestion.",
    "Carry a water bottle to track your intake easily.",
    
    // Exercise Tips
    "Take regular breaks from sitting every 30 minutes.",
    "Include both cardio and strength training in your routine.",
    "Warm up properly before intense workouts.",
    "Cool down and stretch after exercise.",
    "Try high-intensity interval training for efficient workouts.",
    
    // Sleep Tips
    "Aim for 7-9 hours of sleep for optimal health.",
    "Maintain a consistent sleep schedule.",
    "Avoid screens 1 hour before bedtime.",
    "Create a dark, quiet sleep environment.",
    
    // Nutrition Tips
    "Include protein in every meal for better muscle recovery.",
    "Eat a rainbow of fruits and vegetables daily.",
    "Choose whole grains over refined grains.",
    "Limit processed foods and added sugars.",
    
    // Mental Health Tips
    "Practice mindfulness for 5 minutes daily.",
    "Take deep breaths when feeling stressed.",
    "Stay connected with friends and family.",
    "Express gratitude daily.",
    
    // Recovery Tips
    "Stretch before and after workouts to prevent injuries.",
    "Take rest days to allow your body to recover.",
    "Use foam rolling for muscle recovery.",
    "Stay active on rest days with light activities."
  ]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [weeklyWater] = await Promise.all([
          calculateWeeklyWaterIntake(),
          fetchUserProfile(),
          fetchLatestMetrics(),
          fetchDashboardData(),
          fetchGoals()
        ]);
        setWeeklyWaterIntake(weeklyWater);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/users/profile', {
<<<<<<< HEAD
        headers: {
          'Authorization': Bearer ${token}
        }
=======
        headers: { 'Authorization': `Bearer ${token}` }
>>>>>>> sai_task
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchLatestMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/health-metrics/latest', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Map the API response properties to our component's expected format
      const metrics = response.data || {};
      const formattedMetrics = {
        waterIntake: metrics.water || 0,
        sleepDuration: metrics.sleep || 0,
        heartRate: metrics.heartRate || 0,
        oxygenLevel: metrics.oxygenLevel || 0,
        date: metrics.date || new Date().toISOString()
      };
      
      setHealthMetrics(formattedMetrics);
      generateHealthRecommendations(formattedMetrics);
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      // Set default values if fetch fails
      setHealthMetrics({
        waterIntake: 0,
        sleepDuration: 0,
        heartRate: 0,
        oxygenLevel: 0,
        date: new Date().toISOString()
      });
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/workouts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Get current date and date 7 days ago
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Filter workouts from the last 7 days
      const weeklyWorkouts = response.data.filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= lastWeek && workoutDate <= today;
      });
      
      // Calculate total workouts and calories
      const totalWorkouts = weeklyWorkouts.length;
      const totalCalories = weeklyWorkouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);
      
      setWeeklyWorkoutStats({
        totalWorkouts,
        totalCalories: Math.round(totalCalories)
      });
      
      setWorkoutData(weeklyWorkouts);
      setNutritionData(response.data.nutritionData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const calculateWeeklyWaterIntake = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/health-metrics/weekly', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const weeklyData = response.data || [];
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Find today's water intake
      const todayData = weeklyData.find(day => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate.getTime() === today.getTime();
      });
      
      // Calculate current hour (0-23)
      const currentHour = new Date().getHours();
      
      // Calculate average water intake for the day so far
      let averageWater = 0;
      if (todayData) {
        const waterInLiters = (todayData.water || 0) / 1000; // Convert ml to L
        // Calculate average based on current hour (minimum 1 to avoid division by zero)
        averageWater = waterInLiters / Math.max(currentHour, 1);
      }
      
      return averageWater.toFixed(1);
    } catch (error) {
      console.error('Error fetching weekly water intake:', error);
      return '0';
    }
  };

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/goals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const incompleteGoals = response.data
        .filter(goal => {
          const progress = (goal.currentValue / goal.targetValue) * 100;
          return progress < 100;
        })
        .map(goal => ({
          ...goal,
          progress: (goal.currentValue / goal.targetValue) * 100
        }));
      
      setGoals(incompleteGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const generateHealthRecommendations = (metrics) => {
    const newRecommendations = [];
    
    if (metrics.waterIntake < 2000) {
      newRecommendations.push({
        type: 'warning',
        message: 'Try to drink more water today'
      });
    }
    
    if (metrics.sleepDuration < 7) {
      newRecommendations.push({
        type: 'warning',
        message: 'Aim for 7-8 hours of sleep'
      });
    }
    
    if (metrics.heartRate > 100) {
      newRecommendations.push({
        type: 'warning',
        message: 'Your heart rate is elevated. Consider taking a break'
      });
    }
    
    if (metrics.oxygenLevel < 95) {
      newRecommendations.push({
        type: 'warning',
        message: 'Your oxygen level is low. Consider deep breathing exercises'
      });
    }
    
    setRecommendations(newRecommendations);
  };

  const calculateHealthScore = () => {
    let score = 0;
    // Water intake score (max 20 points)
    const waterScore = Math.min((healthMetrics?.waterIntake || 0) / 2000 * 20, 20);
    
    // Sleep score (max 20 points)
    const sleepScore = Math.min((healthMetrics?.sleepDuration || 0) / 8 * 20, 20);
    
    // Workout score (max 20 points)
    const workoutScore = Math.min(weeklyWorkoutStats.totalWorkouts * 4, 20);
    
    // Heart rate score (max 20 points)
    const heartRateScore = healthMetrics?.heartRate 
      ? (healthMetrics.heartRate >= 60 && healthMetrics.heartRate <= 100) ? 20 : 10
      : 0;
    
    // Oxygen level score (max 10 points)
    const oxygenScore = healthMetrics?.oxygenLevel
      ? (healthMetrics.oxygenLevel >= 95) ? 10 : 5
      : 0;
    
    // Streak bonus (max 10 points)
    const streakBonus = Math.min(streak, 10);

    score = waterScore + sleepScore + workoutScore + heartRateScore + oxygenScore + streakBonus;
    setHealthScore(Math.round(score));
  };

  const calculateStreak = () => {
    // Calculate consecutive days of activity
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasWorkout = workoutData.some(workout => {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate.getTime() === checkDate.getTime();
      });

      if (hasWorkout) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  };

  const checkAchievements = () => {
    const newAchievements = [];
    
    // Water intake achievements
    if (healthMetrics?.waterIntake >= 2000) {
      newAchievements.push({ title: "Hydration Hero", icon: "💧", description: "Reached daily water goal" });
    }
    if (healthMetrics?.waterIntake >= 3000) {
      newAchievements.push({ title: "Water Master", icon: "🌊", description: "Exceeded water goal by 50%" });
    }
    
    // Workout achievements
    if (weeklyWorkoutStats.totalWorkouts >= 3) {
      newAchievements.push({ title: "Workout Warrior", icon: "💪", description: "3+ workouts this week" });
    }
    if (weeklyWorkoutStats.totalWorkouts >= 5) {
      newAchievements.push({ title: "Fitness Beast", icon: "🏋️", description: "5+ workouts this week" });
    }
    if (streak >= 7) {
      newAchievements.push({ title: "Streak Master", icon: "🔥", description: "7-day workout streak" });
    }
    if (streak >= 30) {
      newAchievements.push({ title: "Legend", icon: "👑", description: "30-day workout streak" });
    }
    
    // Sleep achievements
    if (healthMetrics?.sleepDuration >= 8) {
      newAchievements.push({ title: "Sleep Champion", icon: "😴", description: "8+ hours of sleep" });
    }
    if (healthMetrics?.sleepDuration >= 9) {
      newAchievements.push({ title: "Sleep Master", icon: "🌙", description: "9+ hours of sleep" });
    }

    // Heart rate achievements
    if (healthMetrics?.heartRate >= 60 && healthMetrics?.heartRate <= 100) {
      newAchievements.push({ title: "Heart Healthy", icon: "❤️", description: "Optimal heart rate" });
    }

    // Oxygen level achievements
    if (healthMetrics?.oxygenLevel >= 98) {
      newAchievements.push({ title: "Oxygen Optimizer", icon: "🫁", description: "Excellent oxygen levels" });
    }

    setAchievements(newAchievements);
  };

  const handleMoodChange = (newMood) => {
    setMood(newMood);
    // Here you could also save the mood to your backend
  };

  const calculateWaterProgress = () => {
    if (!healthMetrics?.waterIntake) return 0;
    const currentWater = healthMetrics.waterIntake;
    const targetWater = 2000; // 2L target
    const progress = (currentWater / targetWater) * 100;
    return Math.min(Math.round(progress), 100);
  };

  useEffect(() => {
    calculateHealthScore();
    calculateStreak();
    checkAchievements();
    
    // Update weekly goals
    const waterProgress = calculateWaterProgress();
    setWeeklyGoals(prev => ({
      ...prev,
      water: waterProgress,
      sleep: ((healthMetrics?.sleepDuration || 0) / 8) * 100
    }));
  }, [healthMetrics, workoutData, weeklyWorkoutStats]);

  // Separate useEffect for workout goals
  useEffect(() => {
    if (weeklyWorkoutStats) {
      setWeeklyGoals(prev => ({
        ...prev,
        workouts: (weeklyWorkoutStats.totalWorkouts / 5) * 100
      }));
    }
  }, [weeklyWorkoutStats]);

  if (isLoading) {
    return (
      <Container className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
<<<<<<< HEAD
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
=======
      <h2 className="mb-4">Welcome back, {user?.firstname || 'User'}!</h2>
      
      {/* Quick Actions Section */}
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Quick Actions</h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Button variant="outline-primary" className="w-100" href="/workouts">
                <FaDumbbell className="me-2" />Log Workout
              </Button>
            </Col>
            <Col md={3}>
              <Button variant="outline-success" className="w-100" href="/nutrition">
                <FaUtensils className="me-2" />Log Meal
              </Button>
            </Col>
            <Col md={3}>
              <Button variant="outline-info" className="w-100" href="/health-metrics">
                <FaHeartbeat className="me-2" />Record Metrics
              </Button>
            </Col>
            <Col md={3}>
              <Button variant="outline-warning" className="w-100" href="/goals">
                <FaChartLine className="me-2" />Set Goals
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        {/* Health Metrics Section */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Today's Health Metrics</h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => fetchLatestMetrics()}
              >
                Refresh
              </Button>
            </Card.Header>
            <Card.Body>
              {healthMetrics ? (
                <>
                  <div className="d-flex align-items-center mb-4">
                    <FaTint className="text-primary me-3" size={24} />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="h6 mb-0">Water Intake</span>
                        <span className="h6 mb-0">{healthMetrics.waterIntake || 0}L / 3L</span>
                      </div>
                      <ProgressBar 
                        now={((healthMetrics.waterIntake || 0) / 3) * 100} 
                        className="mt-1" 
                        style={{ height: '15px' }}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-4">
                    <FaBed className="text-info me-3" size={24} />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="h6 mb-0">Sleep Duration</span>
                        <span className="h6 mb-0">{healthMetrics.sleepDuration || 0}h / 8h</span>
                      </div>
                      <ProgressBar 
                        now={((healthMetrics.sleepDuration || 0) / 8) * 100} 
                        className="mt-1"
                        style={{ height: '15px' }}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-4">
                    <FaHeartbeat className="text-danger me-3" size={24} />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="h6 mb-0">Heart Rate</span>
                        <span className="h6 mb-0">{healthMetrics.heartRate || 0} bpm</span>
                      </div>
                      <div className="progress" style={{ height: '15px' }}>
                        <div 
                          className="progress-bar bg-danger" 
                          role="progressbar" 
                          style={{ width: `${Math.min(100, ((healthMetrics.heartRate || 0) / 100) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaChartLine className="text-success me-3" size={24} />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="h6 mb-0">Oxygen Level</span>
                        <span className="h6 mb-0">{healthMetrics.oxygenLevel || 0}%</span>
                      </div>
                      <div className="progress" style={{ height: '15px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          role="progressbar" 
                          style={{ width: `${Math.min(100, ((healthMetrics.oxygenLevel || 0) / 100) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <small className="text-muted mt-3 d-block">
                    Last updated: {new Date(healthMetrics.date).toLocaleTimeString()}
                  </small>
                </>
              ) : (
                <p className="text-muted text-center mb-0">No health metrics recorded today</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Goals Progress Section */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Active Goals Progress</h5>
            </Card.Header>
            <Card.Body>
              {goals.length > 0 ? (
                goals.map(goal => (
                  <div key={goal.id} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>{goal.description}</span>
                      <span className="text-muted">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <ProgressBar 
                      now={goal.progress} 
                      label={`${Math.round(goal.progress)}%`}
                      variant={goal.progress >= 100 ? 'success' : 'primary'}
                    />
                    <small className="text-muted">
                      Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center mb-0">No active goals. Set some goals to track your progress!</p>
              )}
>>>>>>> sai_task
            </Card.Body>
          </Card>
        </Col>
      </Row>
<<<<<<< HEAD
=======

      {/* Health Score and Streak Section */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h5>Health Score</h5>
              <div className="display-4 mb-3">{healthScore}</div>
              <ProgressBar 
                now={healthScore} 
                max={100} 
                variant={healthScore >= 75 ? "success" : healthScore >= 50 ? "warning" : "danger"}
                className="mb-2"
              />
              <small className="text-muted">Based on your water intake, sleep, workouts, and heart rate</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <h5>Current Streak</h5>
              <div className="display-4 text-center mb-3">
                {streak} days 🔥
              </div>
              <p className="text-center text-muted">
                {streak > 0 
                  ? `Keep up the great work! You've been active for ${streak} days in a row.`
                  : "Start your streak today!"}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Mood Tracker Section */}
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">How are you feeling today?</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-center gap-3">
            {['😢', '😕', '😐', '🙂', '😄'].map((emoji, index) => (
              <Button
                key={index}
                variant={mood === ['sad', 'meh', 'neutral', 'good', 'great'][index] ? 'primary' : 'outline-primary'}
                className="rounded-circle p-3"
                onClick={() => handleMoodChange(['sad', 'meh', 'neutral', 'good', 'great'][index])}
              >
                <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Weekly Goals Progress */}
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Weekly Goals Progress</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <h6>Water Intake</h6>
              <ProgressBar 
                now={weeklyGoals.water} 
                max={100}
                label={`${weeklyGoals.water}%`}
                variant={weeklyGoals.water >= 100 ? "success" : "primary"}
              />
              <small className="text-muted">
                {healthMetrics?.waterIntake 
                  ? `${(healthMetrics.waterIntake / 1000).toFixed(1)}L / 2L` 
                  : '0L / 2L'}
              </small>
            </Col>
            <Col md={4}>
              <h6>Workouts</h6>
              <ProgressBar 
                now={weeklyGoals.workouts} 
                max={100}
                label={`${weeklyWorkoutStats.totalWorkouts}/5`}
                variant={weeklyGoals.workouts >= 100 ? "success" : "primary"}
              />
              <small className="text-muted">Weekly target: 5 workouts</small>
            </Col>
            <Col md={4}>
              <h6>Sleep</h6>
              <ProgressBar 
                now={weeklyGoals.sleep} 
                max={100}
                label={`${healthMetrics?.sleepDuration?.toFixed(1) || 0}/8h`}
                variant={weeklyGoals.sleep >= 100 ? "success" : "primary"}
              />
              <small className="text-muted">Daily target: 8 hours</small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Enhanced Achievements Section */}
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Recent Achievements</h5>
        </Card.Header>
        <Card.Body>
          {achievements.length > 0 ? (
            <Row>
              {achievements.map((achievement, index) => (
                <Col key={index} md={3} className="text-center mb-3">
                  <div className="h4 mb-2">{achievement.icon}</div>
                  <h6>{achievement.title}</h6>
                  <small className="text-muted">{achievement.description}</small>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-center text-muted">Complete activities to earn achievements!</p>
          )}
        </Card.Body>
      </Card>

      {/* Enhanced Health Tips Section */}
      <Card className="mb-4">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Health Tips</h5>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setHealthTips([...healthTips].sort(() => Math.random() - 0.5))}
          >
            New Tip
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="text-center">
            <h4 className="mb-3">💡 {healthTips[0]}</h4>
          </div>
        </Card.Body>
      </Card>

      {/* Weekly Summary Section */}
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Weekly Summary</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <div className="text-center">
                <h6>Total Workouts</h6>
                <h3>{weeklyWorkoutStats.totalWorkouts}</h3>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <h6>Total Calories Burned</h6>
                <h3>{weeklyWorkoutStats.totalCalories}</h3>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <h6>Avg. Sleep Hours</h6>
                <h3>{healthMetrics?.sleepDuration ? healthMetrics.sleepDuration.toFixed(1) : '0'}</h3>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <h6>Avg. Water Intake</h6>
                <h3>{weeklyWaterIntake}L</h3>
                <small className="text-muted">Per hour today</small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
>>>>>>> sai_task
    </Container>
  );
};

export default Dashboard;
