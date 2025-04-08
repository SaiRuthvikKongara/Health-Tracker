package com.healthtracker.controller;

import com.healthtracker.dto.HealthMetricsDto;
import com.healthtracker.model.HealthMetrics;
import com.healthtracker.model.User;
import com.healthtracker.repository.HealthMetricsRepository;
import com.healthtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/health-metrics")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class HealthMetricsController {

        @Autowired
        private HealthMetricsRepository healthMetricsRepository;

        @Autowired
        private UserRepository userRepository;

        @GetMapping
        public ResponseEntity<List<HealthMetricsDto>> getMetrics(Authentication authentication) {
                User user = userRepository.findByUsername(authentication.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<HealthMetrics> metrics = healthMetricsRepository.findByUserIdOrderByDateDesc(user.getId());
                List<HealthMetricsDto> metricDtos = metrics.stream()
                                .map(this::convertToDto)
                                .collect(Collectors.toList());

                return ResponseEntity.ok(metricDtos);
        }

        @GetMapping("/latest")
        public ResponseEntity<HealthMetricsDto> getLatestMetrics(Authentication authentication) {
                User user = userRepository.findByUsername(authentication.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                HealthMetrics latestMetrics = healthMetricsRepository.findFirstByUserIdOrderByDateDesc(user.getId())
                                .orElse(new HealthMetrics());

                return ResponseEntity.ok(convertToDto(latestMetrics));
        }

        @PostMapping
        public ResponseEntity<HealthMetricsDto> createMetrics(Authentication authentication,
                        @RequestBody HealthMetricsDto metricsDto) {
                User user = userRepository.findByUsername(authentication.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                HealthMetrics metrics = new HealthMetrics();
                metrics.setUser(user);
                metrics.setDate(LocalDateTime.now());
                metrics.setWater(metricsDto.getWater());
                metrics.setSleep(metricsDto.getSleep());
                metrics.setHeartRate(metricsDto.getHeartRate());
                metrics.setOxygenLevel(metricsDto.getOxygenLevel());

                metrics = healthMetricsRepository.save(metrics);

                return ResponseEntity.ok(convertToDto(metrics));
        }

        private HealthMetricsDto convertToDto(HealthMetrics metrics) {
                HealthMetricsDto dto = new HealthMetricsDto();
                dto.setId(metrics.getId());
                dto.setUserId(metrics.getUser() != null ? metrics.getUser().getId() : null);
                dto.setDate(metrics.getDate());
                dto.setWater(metrics.getWater());
                dto.setSleep(metrics.getSleep());
                dto.setHeartRate(metrics.getHeartRate());
                dto.setOxygenLevel(metrics.getOxygenLevel());
                return dto;
        }
}