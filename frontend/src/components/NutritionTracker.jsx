import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';

const NutritionTracker = () => {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString(),
    mealType: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: ''
  });

  useEffect(() => {
    fetchNutritionLogs();
  }, []);

  const fetchNutritionLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/nutrition', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setNutritionLogs(data);
    } catch (error) {
      console.error('Error fetching nutrition logs:', error);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const logData = {
        ...newLog,
        date: new Date().toISOString()
      };
      const response = await fetch('http://localhost:8080/api/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(logData)
      });
      if (response.ok) {
        setNewLog({
          date: new Date().toISOString(),
          mealType: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          notes: ''
        });
        fetchNutritionLogs();
      }
    } catch (error) {
      console.error('Error creating nutrition log:', error);
    }
  };

  const calculateDailyTotals = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysLogs = nutritionLogs.filter(log => 
      new Date(log.date).toISOString().split('T')[0] === today
    );

    return todaysLogs.reduce((totals, log) => ({
      calories: totals.calories + (Number(log.calories) || 0),
      protein: totals.protein + (Number(log.protein) || 0),
      carbohydrates: totals.carbohydrates + (Number(log.carbohydrates) || 0),
      fats: totals.fats + (Number(log.fats) || 0),
      fiber: totals.fiber + (Number(log.fiber) || 0),
      sugar: totals.sugar + (Number(log.sugar) || 0),
      sodium: totals.sodium + (Number(log.sodium) || 0)
    }), {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    });
  };

  const dailyTotals = calculateDailyTotals();

  return (
    <Container className="py-4">
      <h2 className="mb-4">Nutrition Tracker</h2>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Log New Meal</Card.Header>
            <Card.Body>
              <Form onSubmit={handleLogSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Meal Type</Form.Label>
                  <Form.Select
                    value={newLog.mealType}
                    onChange={(e) => setNewLog({ ...newLog, mealType: e.target.value })}
                    required
                  >
                    <option value="">Select meal type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Calories</Form.Label>
                  <Form.Control
                    type="number"
                    value={newLog.calories}
                    onChange={(e) => setNewLog({ ...newLog, calories: e.target.value })}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Protein (g)</Form.Label>
                      <Form.Control
                        type="number"
                        value={newLog.protein}
                        onChange={(e) => setNewLog({ ...newLog, protein: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Carbs (g)</Form.Label>
                      <Form.Control
                        type="number"
                        value={newLog.carbs}
                        onChange={(e) => setNewLog({ ...newLog, carbs: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Fat (g)</Form.Label>
                      <Form.Control
                        type="number"
                        value={newLog.fat}
                        onChange={(e) => setNewLog({ ...newLog, fat: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newLog.notes}
                    onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Save Meal
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Today's Nutrition Summary</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <td>Calories</td>
                    <td>{Math.round(dailyTotals.calories)} kcal</td>
                  </tr>
                  <tr>
                    <td>Protein</td>
                    <td>{Math.round(dailyTotals.protein)}g</td>
                  </tr>
                  <tr>
                    <td>Carbohydrates</td>
                    <td>{Math.round(dailyTotals.carbohydrates)}g</td>
                  </tr>
                  <tr>
                    <td>Fats</td>
                    <td>{Math.round(dailyTotals.fats)}g</td>
                  </tr>
                  <tr>
                    <td>Fiber</td>
                    <td>{Math.round(dailyTotals.fiber)}g</td>
                  </tr>
                  <tr>
                    <td>Sugar</td>
                    <td>{Math.round(dailyTotals.sugar)}g</td>
                  </tr>
                  <tr>
                    <td>Sodium</td>
                    <td>{Math.round(dailyTotals.sodium)}mg</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Recent Meals</Card.Header>
            <Card.Body>
              {nutritionLogs.map(log => (
                <Card key={log.id} className="mb-3">
                  <Card.Header>
                    {log.mealType} - {new Date(log.date).toLocaleDateString()}
                  </Card.Header>
                  <Card.Body>
                    <p>Calories: {log.calories}</p>
                    <p>Protein: {log.protein}g</p>
                    <p>Carbs: {log.carbs}g</p>
                    <p>Fat: {log.fat}g</p>
                    {log.notes && <p>Notes: {log.notes}</p>}
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NutritionTracker; 