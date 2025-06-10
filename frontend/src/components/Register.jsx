import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    weight: '',
    gender: ''
  });
  const [error, setError] = useState('');
  const [passwordChecks, setPasswordChecks] = useState({
    hasSpecialChar: false,
    hasNumber: false,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false
  });

  useEffect(() => {
    const password = formData.password;
    setPasswordChecks({
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password)
    });
  }, [formData.password]);

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!Object.values(passwordChecks).every(check => check)) {
      setError('Please meet all password requirements');
      return;
    }
    setStep(2);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = formData.email.split('@')[0];
      
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        gender: formData.gender
      });

      if (response.status === 201 || response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const PasswordRequirement = ({ met, text }) => (
    <div className="d-flex align-items-center mb-2">
      {met ? (
        <FaCheck className="text-success me-2" />
      ) : (
        <FaTimes className="text-danger me-2" />
      )}
      <span className={met ? "text-success" : "text-danger"}>{text}</span>
    </div>
  );

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: '500px' }}>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Register - Step {step}</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {step === 1 ? (
            <Form onSubmit={handleNext}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="mt-2">
                  <PasswordRequirement 
                    met={passwordChecks.hasSpecialChar} 
                    text="Contains at least one special character"
                  />
                  <PasswordRequirement 
                    met={passwordChecks.hasNumber} 
                    text="Contains at least one number"
                  />
                  <PasswordRequirement 
                    met={passwordChecks.hasMinLength} 
                    text="At least 8 characters long"
                  />
                  <PasswordRequirement 
                    met={passwordChecks.hasUpperCase} 
                    text="Contains uppercase letter"
                  />
                  <PasswordRequirement 
                    met={passwordChecks.hasLowerCase} 
                    text="Contains lowercase letter"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100"
                disabled={!Object.values(passwordChecks).every(check => check)}
              >
                Next
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Height (in feet)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Weight (in kg)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={() => setStep(1)} className="w-50">
                  Back
                </Button>
                <Button variant="primary" type="submit" className="w-50">
                  Register
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
