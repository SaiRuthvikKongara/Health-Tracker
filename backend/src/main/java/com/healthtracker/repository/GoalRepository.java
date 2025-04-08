package com.healthtracker.repository;

import com.healthtracker.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Date;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserIdAndStatus(Long userId, String status);

    List<Goal> findByUserIdAndDeadlineAfter(Long userId, Date date);

    List<Goal> findByUserIdOrderByDeadlineAsc(Long userId);
}