package com.healthtracker.repository;

import com.healthtracker.model.NutritionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Date;

public interface NutritionLogRepository extends JpaRepository<NutritionLog, Long> {
    List<NutritionLog> findByUserId(Long userId);

    List<NutritionLog> findByUserIdAndDateAfterOrderByDateDesc(Long userId, Date date);

    List<NutritionLog> findByUserIdOrderByDateDesc(Long userId);

    List<NutritionLog> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDateTime startDate,
            LocalDateTime endDate);

    List<NutritionLog> findByUserIdAndMealTypeOrderByDateDesc(Long userId, String mealType);
}