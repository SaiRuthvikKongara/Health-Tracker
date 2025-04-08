import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaWater, FaBed, FaHeartbeat, FaLungs } from 'react-icons/fa';
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

  useEffect(() => {
    fetchLatestMetrics();
  }, []);

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
    </Container>
  );
};

export default HealthMetrics; 