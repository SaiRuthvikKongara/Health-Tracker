import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { FaPlus, FaTrash, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

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
  const [recommendations, setRecommendations] = useState([]);
  const [nutritionGoals, setNutritionGoals] = useState({
    calories: 2000,
    protein: 56,
    carbs: 275,
    fat: 67,
    fiber: 25,
    sugar: 50,
    sodium: 2300
  });

  useEffect(() => {
    fetchNutritionLogs();
  }, []);

  useEffect(() => {
    if (nutritionLogs.length > 0) {
      generateNutritionRecommendations();
    }
  }, [nutritionLogs]);

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

  const generateNutritionRecommendations = () => {
    const newRecommendations = [];
    const totals = calculateDailyTotals();
    
    // Check calorie intake with progress tracking
    const calorieProgress = (totals.calories / nutritionGoals.calories) * 100;
    if (totals.calories < nutritionGoals.calories * 0.8) {
      newRecommendations.push({
        type: 'warning',
        message: `Your calorie intake is low (${Math.round(calorieProgress)}% of goal). Aim for ${nutritionGoals.calories} calories daily.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: calorieProgress,
        goal: nutritionGoals.calories,
        current: totals.calories
      });
    } else if (totals.calories > nutritionGoals.calories * 1.2) {
      newRecommendations.push({
        type: 'warning',
        message: `Your calorie intake is high (${Math.round(calorieProgress)}% of goal). Consider reducing portion sizes.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: calorieProgress,
        goal: nutritionGoals.calories,
        current: totals.calories
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: `Great job! You've reached ${Math.round(calorieProgress)}% of your daily calorie goal.`,
        icon: <FaCheckCircle className="text-success" />,
        progress: calorieProgress,
        goal: nutritionGoals.calories,
        current: totals.calories
      });
    }

    // Check macronutrient balance with detailed ratios
    const totalMacros = totals.protein + totals.carbohydrates + totals.fats;
    const proteinPercentage = (totals.protein * 4 / totals.calories) * 100;
    const carbPercentage = (totals.carbohydrates * 4 / totals.calories) * 100;
    const fatPercentage = (totals.fats * 9 / totals.calories) * 100;

    // Protein recommendations
    const proteinProgress = (totals.protein / nutritionGoals.protein) * 100;
    if (proteinPercentage < 10) {
      newRecommendations.push({
        type: 'warning',
        message: `Your protein intake is very low (${Math.round(proteinProgress)}% of goal). Include more lean meats, fish, or plant-based proteins.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: proteinProgress,
        goal: nutritionGoals.protein,
        current: totals.protein
      });
    } else if (proteinPercentage > 35) {
      newRecommendations.push({
        type: 'warning',
        message: `Your protein intake is very high (${Math.round(proteinProgress)}% of goal). Balance with more carbs and healthy fats.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: proteinProgress,
        goal: nutritionGoals.protein,
        current: totals.protein
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: `Excellent protein intake! You've reached ${Math.round(proteinProgress)}% of your goal.`,
        icon: <FaCheckCircle className="text-success" />,
        progress: proteinProgress,
        goal: nutritionGoals.protein,
        current: totals.protein
      });
    }

    // Carbohydrate recommendations
    const carbProgress = (totals.carbohydrates / nutritionGoals.carbs) * 100;
    if (carbPercentage < 45) {
      newRecommendations.push({
        type: 'warning',
        message: `Your carb intake is low (${Math.round(carbProgress)}% of goal). Include more whole grains, fruits, and vegetables.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: carbProgress,
        goal: nutritionGoals.carbs,
        current: totals.carbohydrates
      });
    } else if (carbPercentage > 65) {
      newRecommendations.push({
        type: 'warning',
        message: `Your carb intake is high (${Math.round(carbProgress)}% of goal). Focus on complex carbs and reduce simple sugars.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: carbProgress,
        goal: nutritionGoals.carbs,
        current: totals.carbohydrates
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: `Great carb balance! You've reached ${Math.round(carbProgress)}% of your goal.`,
        icon: <FaCheckCircle className="text-success" />,
        progress: carbProgress,
        goal: nutritionGoals.carbs,
        current: totals.carbohydrates
      });
    }

    // Fat recommendations
    const fatProgress = (totals.fats / nutritionGoals.fat) * 100;
    if (fatPercentage < 20) {
      newRecommendations.push({
        type: 'warning',
        message: `Your fat intake is low (${Math.round(fatProgress)}% of goal). Include more healthy fats like avocados, nuts, and olive oil.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: fatProgress,
        goal: nutritionGoals.fat,
        current: totals.fats
      });
    } else if (fatPercentage > 35) {
      newRecommendations.push({
        type: 'warning',
        message: `Your fat intake is high (${Math.round(fatProgress)}% of goal). Focus on unsaturated fats and reduce saturated fats.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: fatProgress,
        goal: nutritionGoals.fat,
        current: totals.fats
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: `Perfect fat intake! You've reached ${Math.round(fatProgress)}% of your goal.`,
        icon: <FaCheckCircle className="text-success" />,
        progress: fatProgress,
        goal: nutritionGoals.fat,
        current: totals.fats
      });
    }

    // Check fiber intake
    const fiberProgress = (totals.fiber / nutritionGoals.fiber) * 100;
    if (totals.fiber < nutritionGoals.fiber * 0.8) {
      newRecommendations.push({
        type: 'warning',
        message: `Your fiber intake is low (${Math.round(fiberProgress)}% of goal). Add more whole grains, fruits, and vegetables.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: fiberProgress,
        goal: nutritionGoals.fiber,
        current: totals.fiber
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: `Great fiber intake! You've reached ${Math.round(fiberProgress)}% of your goal.`,
        icon: <FaCheckCircle className="text-success" />,
        progress: fiberProgress,
        goal: nutritionGoals.fiber,
        current: totals.fiber
      });
    }

    // Check sugar intake
    const sugarProgress = (totals.sugar / nutritionGoals.sugar) * 100;
    if (totals.sugar > nutritionGoals.sugar) {
      newRecommendations.push({
        type: 'warning',
        message: `Your sugar intake is high (${Math.round(sugarProgress)}% of goal). Reduce added sugars and processed foods.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: sugarProgress,
        goal: nutritionGoals.sugar,
        current: totals.sugar
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: `Good sugar control! You've reached ${Math.round(sugarProgress)}% of your goal.`,
        icon: <FaCheckCircle className="text-success" />,
        progress: sugarProgress,
        goal: nutritionGoals.sugar,
        current: totals.sugar
      });
    }

    // Check sodium intake
    const sodiumProgress = (totals.sodium / nutritionGoals.sodium) * 100;
    if (totals.sodium > nutritionGoals.sodium) {
      newRecommendations.push({
        type: 'warning',
        message: `Your sodium intake is high (${Math.round(sodiumProgress)}% of goal). Reduce processed foods and added salt.`,
        icon: <FaExclamationTriangle className="text-warning" />,
        progress: sodiumProgress,
        goal: nutritionGoals.sodium,
        current: totals.sodium
      });
    } else {
      newRecommendations.push({
        type: 'success',
        message: `Good sodium control! You've reached ${Math.round(sodiumProgress)}% of your goal.`,
        icon: <FaCheckCircle className="text-success" />,
        progress: sodiumProgress,
        goal: nutritionGoals.sodium,
        current: totals.sodium
      });
    }

    setRecommendations(newRecommendations);
  };

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

      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Nutrition Recommendations</h5>
            </Card.Header>
            <Card.Body>
              {recommendations.length > 0 ? (
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
              ) : (
                <p className="text-muted text-center mb-0">No nutrition data available yet. Log your meals to get recommendations.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NutritionTracker; 