package com.healthtracker.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DashboardData {
    private List<WorkoutData> workouts;
    private List<NutritionData> nutrition;
    private List<GoalData> goals;
    private HealthMetricsData healthMetrics;

    @Data
    public static class WorkoutData {
        private LocalDateTime date;
        private double caloriesBurned;

        public WorkoutData(LocalDateTime date, double caloriesBurned) {
            this.date = date;
            this.caloriesBurned = caloriesBurned;
        }
    }

    @Data
    public static class NutritionData {
        private LocalDateTime date;
        private double calories;

        public NutritionData(LocalDateTime date, double calories) {
            this.date = date;
            this.calories = calories;
        }
    }

    @Data
    public static class GoalData {
        private Long id;
        private String description;
        private double currentValue;
        private double targetValue;
        private String unit;
        private LocalDateTime deadline;

        public GoalData(Long id, String description, double currentValue, double targetValue, String unit,
                LocalDateTime deadline) {
            this.id = id;
            this.description = description;
            this.currentValue = currentValue;
            this.targetValue = targetValue;
            this.unit = unit;
            this.deadline = deadline;
        }
    }

    @Data
    public static class HealthMetricsData {
        private Double water;
        private Double sleep;
        private Integer heartRate;
        private Integer oxygenLevel;

        public HealthMetricsData(Double water, Double sleep, Integer heartRate, Integer oxygenLevel) {
            this.water = water;
            this.sleep = sleep;
            this.heartRate = heartRate;
            this.oxygenLevel = oxygenLevel;
        }
    }
}