import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const WorkoutTracker = () => {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({
    workoutType: '',
    duration: '',
    caloriesBurned: '',
    date: new Date().toISOString(),
    exercises: []
  });
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    notes: ''
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/workouts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleWorkoutSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const workoutData = {
        ...newWorkout,
        date: new Date().toISOString()
      };
      const response = await axios.post('http://localhost:8080/api/workouts', workoutData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Add the new workout to the list
      setWorkouts([response.data, ...workouts]);
      
      // Reset form
      setNewWorkout({
        workoutType: '',
        duration: '',
        caloriesBurned: '',
        date: new Date().toISOString(),
        exercises: []
      });
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  const addExercise = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, { ...newExercise }]
    });
    setNewExercise({
      name: '',
      sets: '',
      reps: '',
      weight: '',
      duration: '',
      notes: ''
    });
  };

  const removeExercise = (index) => {
    const updatedExercises = newWorkout.exercises.filter((_, i) => i !== index);
    setNewWorkout({
      ...newWorkout,
      exercises: updatedExercises
    });
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Workout Tracker</h2>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Log New Workout</Card.Header>
            <Card.Body>
              <Form onSubmit={handleWorkoutSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Workout Type</Form.Label>
                  <Form.Select
                    value={newWorkout.workoutType}
                    onChange={(e) => setNewWorkout({ ...newWorkout, workoutType: e.target.value })}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="strength">Strength Training</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="hiit">HIIT</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Calories Burned</Form.Label>
                  <Form.Control
                    type="number"
                    value={newWorkout.caloriesBurned}
                    onChange={(e) => setNewWorkout({ ...newWorkout, caloriesBurned: e.target.value })}
                    required
                  />
                </Form.Group>

                <Card className="mb-3">
                  <Card.Header>Exercises</Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Exercise Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={newExercise.name}
                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                      />
                    </Form.Group>

                    <Row>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Sets</Form.Label>
                          <Form.Control
                            type="number"
                            value={newExercise.sets}
                            onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Reps</Form.Label>
                          <Form.Control
                            type="number"
                            value={newExercise.reps}
                            onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Weight (kg)</Form.Label>
                          <Form.Control
                            type="number"
                            value={newExercise.weight}
                            onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Duration (seconds)</Form.Label>
                          <Form.Control
                            type="number"
                            value={newExercise.duration}
                            onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={newExercise.notes}
                        onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                      />
                    </Form.Group>

                    <Button variant="outline-primary" onClick={addExercise}>
                      <FaPlus /> Add Exercise
                    </Button>
                  </Card.Body>
                </Card>

                {newWorkout.exercises.length > 0 && (
                  <Table striped bordered hover className="mb-3">
                    <thead>
                      <tr>
                        <th>Exercise</th>
                        <th>Sets</th>
                        <th>Reps</th>
                        <th>Weight</th>
                        <th>Duration</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newWorkout.exercises.map((exercise, index) => (
                        <tr key={index}>
                          <td>{exercise.name}</td>
                          <td>{exercise.sets}</td>
                          <td>{exercise.reps}</td>
                          <td>{exercise.weight}</td>
                          <td>{exercise.duration}</td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeExercise(index)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}

                <Button variant="primary" type="submit">
                  Save Workout
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>Recent Workouts</Card.Header>
            <Card.Body>
              {workouts.map(workout => (
                <Card key={workout.id} className="mb-3">
                  <Card.Header>
                    {workout.workoutType} - {new Date(workout.date).toLocaleDateString()}
                  </Card.Header>
                  <Card.Body>
                    <p>Duration: {workout.duration} minutes</p>
                    <p>Calories Burned: {workout.caloriesBurned}</p>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Exercise</th>
                          <th>Sets</th>
                          <th>Reps</th>
                          <th>Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workout.exercises && workout.exercises.map((exercise, index) => (
                          <tr key={index}>
                            <td>{exercise.name}</td>
                            <td>{exercise.sets}</td>
                            <td>{exercise.reps}</td>
                            <td>{exercise.weight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
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

export default WorkoutTracker; 