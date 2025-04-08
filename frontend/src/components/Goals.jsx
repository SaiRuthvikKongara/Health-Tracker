import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ProgressBar } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState('');
  const [newGoal, setNewGoal] = useState({
    goalType: '',
    description: '',
    targetValue: '',
    unit: '',
    targetDate: '',
    notes: '',
    status: 'IN_PROGRESS'
  });

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
      const data = response.data;
      setGoals(Array.isArray(data) ? data : []);
      setError('');
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Failed to fetch goals. Please try again.');
      setGoals([]); // Ensure goals is an empty array on error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Format the dates as ISO strings with time component
      const startDate = new Date();
      const targetDate = new Date(newGoal.targetDate);
      targetDate.setHours(23, 59, 59); // Set to end of day
      
      const goalData = {
        ...newGoal,
        startDate: startDate.toISOString(),
        targetDate: targetDate.toISOString(),
        targetValue: parseFloat(newGoal.targetValue),
        currentValue: 0.0,
        status: 'IN_PROGRESS'
      };

      console.log('Sending goal data:', goalData); // Debug log

      const response = await axios.post('http://localhost:8080/api/goals', goalData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 201 || response.status === 200) {
        setNewGoal({
          goalType: '',
          description: '',
          targetValue: '',
          unit: '',
          targetDate: '',
          notes: '',
          status: 'IN_PROGRESS'
        });
        await fetchGoals();
        setError('');
      }
    } catch (error) {
      console.error('Error creating goal:', error.response?.data || error.message);
      setError('Failed to create goal. Please try again.');
    }
  };

  const updateProgress = async (goalId, currentValue) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8080/api/goals/${goalId}/progress`, 
        { currentValue: parseFloat(currentValue) },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        await fetchGoals();
        setError('');
      }
    } catch (error) {
      console.error('Error updating goal progress:', error.response?.data || error.message);
      setError('Failed to update goal progress. Please try again.');
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8080/api/goals/${goalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        await fetchGoals();
        setError('');
      }
    } catch (error) {
      console.error('Error deleting goal:', error.response?.data || error.message);
      setError('Failed to delete goal. Please try again.');
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
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
          <Card className="mb-4">
            <Card.Header>Set New Goal</Card.Header>
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
                    type="text"
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
                        step="0.01"
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
                  Set Goal
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>Active Goals</Card.Header>
            <Card.Body>
              {Array.isArray(goals) && goals.length > 0 ? (
                goals.map(goal => (
                  <Card key={goal.id} className="mb-3">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <span>{goal.description}</span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        <FaTrash />
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Progress</span>
                          <span>
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </span>
                        </div>
                        <ProgressBar
                          now={calculateProgress(goal.currentValue, goal.targetValue)}
                          label={`${calculateProgress(goal.currentValue, goal.targetValue)}%`}
                        />
                      </div>

                      <Form.Group className="mb-3">
                        <Form.Label>Update Progress</Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Control
                            type="number"
                            step="0.01"
                            placeholder={`Current ${goal.unit}`}
                            onChange={(e) => updateProgress(goal.id, e.target.value)}
                          />
                          <Button variant="outline-primary" size="sm">
                            Update
                          </Button>
                        </div>
                      </Form.Group>

                      <div className="text-muted">
                        <small>
                          Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                        </small>
                        {goal.notes && (
                          <p className="mb-0">
                            <small>Notes: {goal.notes}</small>
                          </p>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="text-muted text-center">No goals yet. Create one to get started!</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Goals; 