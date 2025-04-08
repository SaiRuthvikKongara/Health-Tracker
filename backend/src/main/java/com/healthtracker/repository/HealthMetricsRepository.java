package com.healthtracker.repository;

import com.healthtracker.model.HealthMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface HealthMetricsRepository extends JpaRepository<HealthMetrics, Long> {
    List<HealthMetrics> findByUserIdOrderByDateDesc(Long userId);

    List<HealthMetrics> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDateTime start, LocalDateTime end);

    Optional<HealthMetrics> findFirstByUserIdOrderByDateDesc(Long userId);
}