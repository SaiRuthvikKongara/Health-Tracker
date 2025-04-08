import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ProgressBar } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const GoalsTracker = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    goalType: '',
    description: '',
    targetValue: '',
    unit: '',
    targetDate: '',
    notes: '',
    status: 'IN_PROGRESS'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/goals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setGoals(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Failed to fetch goals. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const goalData = {
        ...newGoal,
        startDate: new Date().toISOString(),
        targetDate: new Date(newGoal.targetDate).toISOString(),
        targetValue: Number(newGoal.targetValue),
        currentValue: 0,
        status: 'IN_PROGRESS'
      };
      
      const response = await axios.post('http://localhost:8080/api/goals', goalData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Add the new goal to the list and refresh goals
      await fetchGoals();
      
      // Reset form
      setNewGoal({
        goalType: '',
        description: '',
        targetValue: '',
        unit: '',
        targetDate: '',
        notes: '',
        status: 'IN_PROGRESS'
      });
      setError('');
    } catch (error) {
      console.error('Error creating goal:', error);
      setError('Failed to create goal. Please try again.');
    }
  };

  const updateProgress = async (goalId, currentValue) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/goals/${goalId}/progress`, {
        currentValue: Number(currentValue)
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh goals after update
      await fetchGoals();
      setError('');
    } catch (error) {
      console.error('Error updating goal progress:', error);
      setError('Failed to update goal progress. Please try again.');
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/goals/${goalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh goals after deletion
      await fetchGoals();
      setError('');
    } catch (error) {
      console.error('Error deleting goal:', error);
      setError('Failed to delete goal. Please try again.');
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Health Goals</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-primary text-white">Set New Goal</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Goal Type</Form.Label>
                  <Form.Select
                    value={newGoal.goalType}
                    onChange={(e) => setNewGoal({ ...newGoal, goalType: e.target.value })}
                    required
                  >
                    <option value="">Select goal type</option>
                    <option value="WEIGHT">Weight</option>
                    <option value="FITNESS">Fitness</option>
                    <option value="NUTRITION">Nutrition</option>
                    <option value="LIFESTYLE">Lifestyle</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Target Value</Form.Label>
                      <Form.Control
                        type="number"
                        value={newGoal.targetValue}
                        onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Unit</Form.Label>
                      <Form.Select
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                        required
                      >
                        <option value="">Select unit</option>
                        <option value="kg">kg</option>
                        <option value="lbs">lbs</option>
                        <option value="min">minutes</option>
                        <option value="days">days</option>
                        <option value="times">times</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Target Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newGoal.notes}
                    onChange={(e) => setNewGoal({ ...newGoal, notes: e.target.value })}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Save Goal
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">My Goals</Card.Header>
            <Card.Body>
              {goals.length === 0 ? (
                <p className="text-center text-muted">No goals yet. Create one to get started!</p>
              ) : (
                goals.map(goal => (
                  <Card key={goal.id} className="mb-3 border">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">{goal.goalType}</span>
                      <div>
                        <span className={`badge ${goal.status === 'COMPLETED' ? 'bg-success' : 'bg-warning'} me-2`}>
                          {goal.status}
                        </span>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <p className="mb-2">{goal.description}</p>
                      <div className="d-flex justify-content-between mb-2">
                        <small>Target: {goal.targetValue} {goal.unit}</small>
                        <small>Current: {goal.currentValue} {goal.unit}</small>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">
                          Deadline: {new Date(goal.targetDate).toLocaleDateString()}
                        </small>
                      </div>
                      <ProgressBar
                        now={(goal.currentValue / goal.targetValue) * 100}
                        label={`${Math.round((goal.currentValue / goal.targetValue) * 100)}%`}
                        variant={goal.status === 'COMPLETED' ? 'success' : 'primary'}
                        className="mb-2"
                      />
                      <Form.Control
                        type="number"
                        placeholder="Update progress"
                        className="mt-2"
                        onChange={(e) => updateProgress(goal.id, e.target.value)}
                      />
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GoalsTracker; 