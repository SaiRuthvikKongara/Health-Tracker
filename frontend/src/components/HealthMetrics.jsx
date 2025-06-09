import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaWater, FaBed, FaHeartbeat, FaLungs, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const HealthMetrics = () => {
  const [metrics, setMetrics] = useState({
    water: '',
    sleep: '',
    heartRate: '',
    oxygenLevel: ''
  });

  const [latestMetrics, setLatestMetrics] = useState(null);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [healthGoals, setHealthGoals] = useState({
    water: 2.5,
    sleep: 8,
    heartRate: { min: 60, max: 100 },
    oxygenLevel: 95
  });

  useEffect(() => {
    fetchLatestMetrics();
    generateHealthRecommendations();
  }, [latestMetrics]);

  const fetchLatestMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/health-metrics/latest', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setLatestMetrics(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setError('Failed to fetch latest metrics');
    }
  };

  const generateHealthRecommendations = () => {
    const newRecommendations = [];
    
    // Check water intake with progress tracking
    const waterProgress = (latestMetrics?.water / healthGoals.water) * 100;
    if (latestMetrics?.water < healthGoals.water * 0.8) {
      newRecommendations.push({
        type: 'warning',
        message: `Your water intake is low (${Math.round(waterProgress)}% of goal). Try to drink at least ${healthGoals.water}L daily.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: waterProgress,
        goal: healthGoals.water,
        current: latestMetrics?.water || 0
      });
    } else if (latestMetrics?.water > healthGoals.water * 1.5) {
      newRecommendations.push({
        type: 'warning',
        message: `Your water intake is high (${Math.round(waterProgress)}% of goal). Drinking too much water can be harmful.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: waterProgress,
        goal: healthGoals.water,
        current: latestMetrics?.water || 0
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: `Great job! You've reached ${Math.round(waterProgress)}% of your water intake goal.`,
        icon: <FaCheckCircle className="text-success" />,
        progress: waterProgress,
        goal: healthGoals.water,
        current: latestMetrics?.water || 0
      });
    }

    // Check sleep duration with progress tracking
    const sleepProgress = (latestMetrics?.sleep / healthGoals.sleep) * 100;
    if (latestMetrics?.sleep < healthGoals.sleep * 0.8) {
      newRecommendations.push({
        type: 'warning',
        message: `You need more sleep (${Math.round(sleepProgress)}% of goal). Aim for ${healthGoals.sleep} hours per night.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: sleepProgress,
        goal: healthGoals.sleep,
        current: latestMetrics?.sleep || 0
      });
    } else if (latestMetrics?.sleep > healthGoals.sleep * 1.2) {
      newRecommendations.push({
        type: 'warning',
        message: `You might be oversleeping (${Math.round(sleepProgress)}% of goal). Try to maintain ${healthGoals.sleep} hours.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: sleepProgress,
        goal: healthGoals.sleep,
        current: latestMetrics?.sleep || 0
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: `Perfect sleep duration! You've reached ${Math.round(sleepProgress)}% of your goal.`,
        icon: <FaCheckCircle className="text-success" />,
        progress: sleepProgress,
        goal: healthGoals.sleep,
        current: latestMetrics?.sleep || 0
      });
    }

    // Check heart rate with detailed analysis
    const heartRate = latestMetrics?.heartRate || 0;
    const heartRateProgress = heartRate < healthGoals.heartRate.min 
      ? (heartRate / healthGoals.heartRate.min) * 100 
      : heartRate > healthGoals.heartRate.max 
        ? (healthGoals.heartRate.max / heartRate) * 100 
        : 100;

    if (heartRate < healthGoals.heartRate.min) {
      newRecommendations.push({
        type: 'warning',
        message: `Your heart rate is below normal (${heartRate} BPM). Consider consulting a doctor.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: heartRateProgress,
        goal: healthGoals.heartRate.min,
        current: heartRate
      });
    } else if (heartRate > healthGoals.heartRate.max) {
      newRecommendations.push({
        type: 'warning',
        message: `Your heart rate is elevated (${heartRate} BPM). Try to relax and reduce stress.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: heartRateProgress,
        goal: healthGoals.heartRate.max,
        current: heartRate
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: `Excellent heart rate! Your ${heartRate} BPM is within the healthy range.`,
        icon: <FaCheckCircle className="text-success" />,
        progress: heartRateProgress,
        goal: healthGoals.heartRate.max,
        current: heartRate
      });
    }

    // Check oxygen level with progress tracking
    const oxygenLevel = latestMetrics?.oxygenLevel || 0;
    const oxygenProgress = (oxygenLevel / healthGoals.oxygenLevel) * 100;
    if (oxygenLevel < healthGoals.oxygenLevel) {
      newRecommendations.push({
        type: 'warning',
        message: `Your oxygen level is below normal (${oxygenLevel}%). Consider consulting a doctor.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: oxygenProgress,
        goal: healthGoals.oxygenLevel,
        current: oxygenLevel
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: `Great oxygen level! Your ${oxygenLevel}% is within the healthy range.`,
        icon: <FaCheckCircle className="text-success" />,
        progress: oxygenProgress,
        goal: healthGoals.oxygenLevel,
        current: oxygenLevel
      });
    }

    setRecommendations(newRecommendations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const metricsData = {
        water: parseFloat(metrics.water),
        sleep: parseFloat(metrics.sleep),
        heartRate: parseInt(metrics.heartRate),
        oxygenLevel: parseInt(metrics.oxygenLevel),
        date: new Date().toISOString()
      };

      const response = await axios.post('http://localhost:8080/api/health-metrics', metricsData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201 || response.status === 200) {
        setMetrics({
          water: '',
          sleep: '',
          heartRate: '',
          oxygenLevel: ''
        });
        await fetchLatestMetrics();
        setError('');
      }
    } catch (error) {
      console.error('Error saving metrics:', error);
      setError('Failed to save metrics. Please try again.');
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Health Metrics</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Enter Today's Metrics</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaWater className="me-2" />
                    Water Intake (Liters)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={metrics.water}
                    onChange={(e) => setMetrics({ ...metrics, water: e.target.value })}
                    required
                    placeholder="Enter water intake in liters"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaBed className="me-2" />
                    Sleep Duration (Hours)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={metrics.sleep}
                    onChange={(e) => setMetrics({ ...metrics, sleep: e.target.value })}
                    required
                    placeholder="Enter sleep duration in hours"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaHeartbeat className="me-2" />
                    Heart Rate (BPM)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="1"
                    min="40"
                    max="220"
                    value={metrics.heartRate}
                    onChange={(e) => setMetrics({ ...metrics, heartRate: e.target.value })}
                    required
                    placeholder="Enter heart rate in beats per minute"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaLungs className="me-2" />
                    Oxygen Level (%)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="1"
                    min="80"
                    max="100"
                    value={metrics.oxygenLevel}
                    onChange={(e) => setMetrics({ ...metrics, oxygenLevel: e.target.value })}
                    required
                    placeholder="Enter oxygen level percentage"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Save Metrics
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100 bg-info bg-opacity-10 border-0">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <FaWater className="text-info me-2" size={24} />
                    <h6 className="mb-0">Water Intake</h6>
                  </div>
                  <h3 className="mb-2">{latestMetrics?.water || 0}L</h3>
                  <p className="text-muted mb-0">Today's intake</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100 bg-warning bg-opacity-10 border-0">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <FaBed className="text-warning me-2" size={24} />
                    <h6 className="mb-0">Sleep Duration</h6>
                  </div>
                  <h3 className="mb-2">{latestMetrics?.sleep || 0}hrs</h3>
                  <p className="text-muted mb-0">Last night</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100 bg-danger bg-opacity-10 border-0">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <FaHeartbeat className="text-danger me-2" size={24} />
                    <h6 className="mb-0">Heart Rate</h6>
                  </div>
                  <h3 className="mb-2">{latestMetrics?.heartRate || 0} BPM</h3>
                  <p className="text-muted mb-0">Current</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100 bg-success bg-opacity-10 border-0">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <FaLungs className="text-success me-2" size={24} />
                    <h6 className="mb-0">Oxygen Level</h6>
                  </div>
                  <h3 className="mb-2">{latestMetrics?.oxygenLevel || 0}%</h3>
                  <p className="text-muted mb-0">SpO2</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
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
                    <div className={`d-flex flex-column p-3 rounded ${rec.type === 'warning' ? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'}`}>
                      <div className="d-flex align-items-center mb-2">
                        <div className="me-3">
                          {rec.icon}
                        </div>
                        <div>
                          <p className="mb-0">{rec.message}</p>
                        </div>
                      </div>
                      <div className="progress" style={{ height: '10px' }}>
                        <div 
                          className={`progress-bar ${rec.type === 'warning' ? 'bg-warning' : 'bg-success'}`}
                          role="progressbar"
                          style={{ width: `${Math.min(100, rec.progress)}%` }}
                          aria-valuenow={rec.progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <small className="text-muted mt-1">
                        {Math.round(rec.current)} / {rec.goal} {rec.type === 'warning' ? '⚠️' : '✓'}
                      </small>
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

export default HealthMetrics; 