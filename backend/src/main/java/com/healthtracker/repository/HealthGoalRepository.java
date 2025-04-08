package com.healthtracker.repository;

import com.healthtracker.model.HealthGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HealthGoalRepository extends JpaRepository<HealthGoal, Long> {
    List<HealthGoal> findByUserIdOrderByStartDateDesc(Long userId);

    List<HealthGoal> findByUserIdAndStatusOrderByStartDateDesc(Long userId, String status);

    List<HealthGoal> findByUserIdAndGoalTypeOrderByStartDateDesc(Long userId, String goalType);
}