# Health Tracker

A comprehensive health monitoring application built with React and Spring Boot.

## Configuration

### Backend Configuration

1. Copy the template configuration file:
   ```bash
   cp src/main/resources/application.properties.template src/main/resources/application.properties
   ```

2. Update the following properties in `application.properties`:
   - `spring.datasource.url`: Your database URL
   - `spring.datasource.username`: Your database username
   - `spring.datasource.password`: Your database password
   - `jwt.secret`: Your JWT secret key

### Environment Variables

For additional security, you can use environment variables:

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/healthtracker
export SPRING_DATASOURCE_USERNAME=your_username
export SPRING_DATASOURCE_PASSWORD=your_password
export JWT_SECRET=your_jwt_secret_key
```

## Security Note

Never commit your actual `application.properties` file to version control. Always use the template file and keep your actual configuration local.

## Development

1. Start the backend server:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Features

- User Authentication
- Health Metrics Tracking
- Nutrition Management
- Workout Planning
- Health Goals Setting
- Dashboard Analytics

## Technologies Used

- Frontend: React.js
- Backend: Spring Boot
- Database: MySQL
- Authentication: JWT 