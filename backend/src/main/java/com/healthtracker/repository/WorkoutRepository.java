package com.healthtracker.repository;

import com.healthtracker.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Date;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUserId(Long userId);

    List<Workout> findByUserIdAndDateAfterOrderByDateDesc(Long userId, Date date);

    List<Workout> findByUserIdOrderByDateDesc(Long userId);

    List<Workout> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDateTime startDate,
            LocalDateTime endDate);

    List<Workout> findByUserIdAndWorkoutTypeOrderByDateDesc(Long userId, String workoutType);
}