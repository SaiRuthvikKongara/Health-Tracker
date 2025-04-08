package com.healthtracker.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HealthMetricsDto {
    private Long id;
    private Long userId;
    private LocalDateTime date;
    private Double water;
    private Double sleep;
    private Integer heartRate;
    private Integer oxygenLevel;
}