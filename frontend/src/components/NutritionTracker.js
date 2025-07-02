import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';

const NutritionTracker = () => {
    const [mealType, setMealType] = useState('');
    const [foodName, setFoodName] = useState('');
    const [portionSize, setPortionSize] = useState('');
    const [portionUnit, setPortionUnit] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fats, setFats] = useState('');
    const [fiber, setFiber] = useState('');
    const [sugar, setSugar] = useState('');
    const [sodium, setSodium] = useState('');
    const [notes, setNotes] = useState('');
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/nutrition', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMeals(response.data);
        } catch (error) {
            console.error('Error fetching meals:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const mealData = {
                mealType,
                foodName,
                portionSize: parseFloat(portionSize),
                portionUnit,
                calories: parseFloat(calories),
                protein: parseFloat(protein),
                carbohydrates: parseFloat(carbs),
                fats: parseFloat(fats),
                fiber: parseFloat(fiber),
                sugar: parseFloat(sugar),
                sodium: parseFloat(sodium),
                notes,
                date: new Date().toISOString()
            };

            await axios.post('http://localhost:8080/api/nutrition', mealData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // Reset form
            setMealType('');
            setFoodName('');
            setPortionSize('');
            setPortionUnit('');
            setCalories('');
            setProtein('');
            setCarbs('');
            setFats('');
            setFiber('');
            setSugar('');
            setSodium('');
            setNotes('');

            // Refresh meals
            fetchMeals();
        } catch (error) {
            console.error('Error adding meal:', error);
        }
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Nutrition Tracker</h2>
            <Row className="d-flex align-items-start">
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header className="bg-white">
                            <h4 className="mb-0">Log New Meal</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Meal Type</Form.Label>
                                    <Form.Select
                                        value={mealType}
                                        onChange={(e) => setMealType(e.target.value)}
                                        required
                                    >
                                        <option value="">Select meal type</option>
                                        <option value="Breakfast">Breakfast</option>
                                        <option value="Lunch">Lunch</option>
                                        <option value="Dinner">Dinner</option>
                                        <option value="Snack">Snack</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Food Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={foodName}
                                        onChange={(e) => setFoodName(e.target.value)}
                                        required
                                        placeholder="Enter food name"
                                    />
                                </Form.Group>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Portion Size</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={portionSize}
                                                onChange={(e) => setPortionSize(e.target.value)}
                                                required
                                                placeholder="Enter portion size"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Unit</Form.Label>
                                            <Form.Select
                                                value={portionUnit}
                                                onChange={(e) => setPortionUnit(e.target.value)}
                                                required
                                            >
                                                <option value="">Select unit</option>
                                                <option value="g">grams</option>
                                                <option value="oz">ounces</option>
                                                <option value="ml">milliliters</option>
                                                <option value="cup">cups</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Calories</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={calories}
                                                onChange={(e) => setCalories(e.target.value)}
                                                required
                                                placeholder="Enter calories"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Protein (g)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={protein}
                                                onChange={(e) => setProtein(e.target.value)}
                                                placeholder="Enter protein"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Carbohydrates (g)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={carbs}
                                                onChange={(e) => setCarbs(e.target.value)}
                                                placeholder="Enter carbs"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Fats (g)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={fats}
                                                onChange={(e) => setFats(e.target.value)}
                                                placeholder="Enter fats"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Fiber (g)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={fiber}
                                                onChange={(e) => setFiber(e.target.value)}
                                                placeholder="Enter fiber"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Sugar (g)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={sugar}
                                                onChange={(e) => setSugar(e.target.value)}
                                                placeholder="Enter sugar"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Sodium (mg)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={sodium}
                                        onChange={(e) => setSodium(e.target.value)}
                                        placeholder="Enter sodium"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add any notes about your meal"
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Log Meal
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-white">
                            <h4 className="mb-0">Recent Meals</h4>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '795px', overflowY: 'auto' }}>
                            {meals.length === 0 ? (
                                <p className="text-muted">No meals logged yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {meals.map((meal) => (
                                        <Card key={meal.id} className="mb-3">
                                            <Card.Header>
                                                {meal.foodName} - {new Date(meal.date).toLocaleDateString()}
                                            </Card.Header>
                                            <Card.Body>
                                                <Table striped bordered hover size="sm">
                                                    <tbody>
                                                        <tr>
                                                            <td>Meal Type</td>
                                                            <td>{meal.mealType}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Portion</td>
                                                            <td>{meal.portionSize} {meal.portionUnit}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Calories</td>
                                                            <td>{meal.calories} kcal</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Protein</td>
                                                            <td>{meal.protein}g</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Carbs</td>
                                                            <td>{meal.carbohydrates}g</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Fats</td>
                                                            <td>{meal.fats}g</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Fiber</td>
                                                            <td>{meal.fiber}g</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Sugar</td>
                                                            <td>{meal.sugar}g</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Sodium</td>
                                                            <td>{meal.sodium}mg</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                {meal.notes && (
                                                    <p className="mt-2 text-muted">Notes: {meal.notes}</p>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default NutritionTracker; 