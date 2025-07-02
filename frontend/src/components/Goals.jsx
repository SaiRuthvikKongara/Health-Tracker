import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Toast, ProgressBar } from 'react-bootstrap';
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

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
      setGoals([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const startDate = new Date();
      const targetDate = new Date(newGoal.targetDate);
      targetDate.setHours(23, 59, 59);
      
      const goalData = {
        ...newGoal,
        startDate: startDate.toISOString(),
        targetDate: targetDate.toISOString(),
        targetValue: parseFloat(newGoal.targetValue),
        currentValue: 0.0,
        status: 'IN_PROGRESS'
      };

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
        setToastMessage('Goal created successfully!');
        setToastVariant('success');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error creating goal:', error.response?.data || error.message);
      setError('Failed to create goal. Please try again.');
      setToastMessage(error.response?.data?.message || 'Failed to create goal');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const updateProgress = async (goalId, currentValue) => {
    try {
      // Find the goal to check its current progress
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      // Calculate current progress
      const currentProgress = calculateProgress(goal.currentValue, goal.targetValue);
      
      // If goal is already completed (100%), prevent further updates
      if (currentProgress === 100) {
        setToastMessage('Cannot update progress of a completed goal');
        setToastVariant('warning');
        setShowToast(true);
        return;
      }

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
        setToastMessage('Goal progress updated successfully!');
        setToastVariant('success');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error updating goal progress:', error.response?.data || error.message);
      setError('Failed to update goal progress. Please try again.');
      setToastMessage(error.response?.data?.message || 'Failed to update goal progress');
      setToastVariant('danger');
      setShowToast(true);
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
        setToastMessage('Goal deleted successfully!');
        setToastVariant('success');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error deleting goal:', error.response?.data || error.message);
      setError('Failed to delete goal. Please try again.');
      setToastMessage(error.response?.data?.message || 'Failed to delete goal');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const handleUpdateStatus = async (goalId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:8080/api/goals/${goalId}`, 
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setToastMessage('Goal status updated successfully!');
      setToastVariant('success');
      setShowToast(true);

      // Refresh goals
      fetchGoals();
    } catch (error) {
      setToastMessage(error.response?.data?.message || 'Failed to update goal status');
      setToastVariant('danger');
      setShowToast(true);
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
      <Row className="d-flex align-items-start">
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-white">
              <h4 className="mb-0">Set New Goal</h4>
            </Card.Header>
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
            <Card.Header className="bg-white">
              <h4 className="mb-0">Active Goals</h4>
            </Card.Header>
            <Card.Body style={{ maxHeight: '544px', overflowY: 'auto' }}>
              {goals.length > 0 ? (
                goals.map(goal => {
                  const progress = calculateProgress(goal.currentValue, goal.targetValue);
                  const isCompleted = progress === 100;
                  
                  return (
                    <Card key={goal.id} className="mb-3">
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <span>{goal.description}</span>
                        <Button
                          variant="danger"
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
                            now={progress}
                            label={`${progress}%`}
                            variant={isCompleted ? 'success' : 'primary'}
                          />
                        </div>

                        {!isCompleted && (
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
                        )}

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
                  );
                })
              ) : (
                <p className="text-muted text-center">No goals yet. Create one to get started!</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg={toastVariant}
          className="text-white"
        >
          <Toast.Header closeButton>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Success' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </div>
    </Container>
  );
};

export default Goals; 