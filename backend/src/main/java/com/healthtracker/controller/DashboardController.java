package com.healthtracker.controller;

import com.healthtracker.dto.DashboardData;
import com.healthtracker.model.HealthGoal;
import com.healthtracker.model.NutritionLog;
import com.healthtracker.model.Workout;
import com.healthtracker.model.HealthMetrics;
import com.healthtracker.repository.HealthGoalRepository;
import com.healthtracker.repository.NutritionLogRepository;
import com.healthtracker.repository.WorkoutRepository;
import com.healthtracker.repository.HealthMetricsRepository;
import com.healthtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

        @Autowired
        private WorkoutRepository workoutRepository;

        @Autowired
        private NutritionLogRepository nutritionLogRepository;

        @Autowired
        private HealthGoalRepository healthGoalRepository;

        @Autowired
        private HealthMetricsRepository healthMetricsRepository;

        @Autowired
        private UserRepository userRepository;

        @GetMapping
        public ResponseEntity<DashboardData> getDashboardData(Authentication authentication) {
                String username = authentication.getName();
                Long userId = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"))
                                .getId();

                // Get last 7 days of workouts
                Date sevenDaysAgo = Date
                                .from(LocalDate.now().minusDays(7).atStartOfDay(ZoneId.systemDefault()).toInstant());
                List<Workout> recentWorkouts = workoutRepository.findByUserIdAndDateAfterOrderByDateDesc(userId,
                                sevenDaysAgo);

                // Get last 7 days of nutrition logs
                List<NutritionLog> recentNutritionLogs = nutritionLogRepository.findByUserIdAndDateAfterOrderByDateDesc(
                                userId,
                                sevenDaysAgo);

                // Get active goals
                List<HealthGoal> activeGoals = healthGoalRepository.findByUserIdAndStatusOrderByStartDateDesc(userId,
                                "IN_PROGRESS");

                // Get latest health metrics
                Optional<HealthMetrics> latestMetrics = healthMetricsRepository
                                .findFirstByUserIdOrderByDateDesc(userId);

                DashboardData dashboardData = new DashboardData();
                dashboardData.setWorkouts(recentWorkouts.stream()
                                .map(workout -> new DashboardData.WorkoutData(
                                                workout.getDate(),
                                                workout.getCaloriesBurned()))
                                .collect(Collectors.toList()));

                dashboardData.setNutrition(recentNutritionLogs.stream()
                                .map(log -> new DashboardData.NutritionData(
                                                log.getDate(),
                                                log.getCalories()))
                                .collect(Collectors.toList()));

                dashboardData.setGoals(activeGoals.stream()
                                .map(goal -> new DashboardData.GoalData(
                                                goal.getId(),
                                                goal.getDescription(),
                                                goal.getCurrentValue(),
                                                goal.getTargetValue(),
                                                goal.getUnit(),
                                                goal.getTargetDate()))
                                .collect(Collectors.toList()));

                latestMetrics.ifPresent(metrics -> {
                        dashboardData.setHealthMetrics(new DashboardData.HealthMetricsData(
                                        metrics.getWater(),
                                        metrics.getSleep(),
                                        metrics.getHeartRate(),
                                        metrics.getOxygenLevel()));
                });

                return ResponseEntity.ok(dashboardData);
        }
}