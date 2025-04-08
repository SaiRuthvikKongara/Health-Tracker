package com.healthtracker.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "nutrition_logs")
public class NutritionLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private String mealType;

    @Column(nullable = false)
    private String foodName;

    private Double portionSize;
    private String portionUnit;
    private Integer calories;
    private Double protein;
    private Double carbohydrates;
    private Double fats;
    private Double fiber;
    private Double sugar;
    private Double sodium;
    private String notes;
}