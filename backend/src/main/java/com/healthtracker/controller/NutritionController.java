package com.healthtracker.controller;

import com.healthtracker.dto.NutritionLogDto;
import com.healthtracker.model.NutritionLog;
import com.healthtracker.model.User;
import com.healthtracker.repository.NutritionLogRepository;
import com.healthtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/nutrition")
public class NutritionController {

    @Autowired
    private NutritionLogRepository nutritionLogRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<NutritionLogDto>> getNutritionLogs(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<NutritionLog> logs = nutritionLogRepository.findByUserIdOrderByDateDesc(user.getId());
        List<NutritionLogDto> logDtos = logs.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(logDtos);
    }

    @PostMapping
    public ResponseEntity<NutritionLogDto> createNutritionLog(Authentication authentication,
            @RequestBody NutritionLogDto logDto) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        NutritionLog log = new NutritionLog();
        log.setUser(user);
        log.setDate(logDto.getDate());
        log.setMealType(logDto.getMealType());
        log.setFoodName(logDto.getFoodName());
        log.setPortionSize(logDto.getPortionSize());
        log.setPortionUnit(logDto.getPortionUnit());
        log.setCalories(logDto.getCalories());
        log.setProtein(logDto.getProtein());
        log.setCarbohydrates(logDto.getCarbohydrates());
        log.setFats(logDto.getFats());
        log.setFiber(logDto.getFiber());
        log.setSugar(logDto.getSugar());
        log.setSodium(logDto.getSodium());
        log.setNotes(logDto.getNotes());

        log = nutritionLogRepository.save(log);

        return ResponseEntity.ok(convertToDto(log));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNutritionLog(Authentication authentication, @PathVariable Long id) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        NutritionLog log = nutritionLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nutrition log not found"));

        if (!log.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        nutritionLogRepository.delete(log);
        return ResponseEntity.ok().build();
    }

    private NutritionLogDto convertToDto(NutritionLog log) {
        NutritionLogDto dto = new NutritionLogDto();
        dto.setId(log.getId());
        dto.setUserId(log.getUser().getId());
        dto.setDate(log.getDate());
        dto.setMealType(log.getMealType());
        dto.setFoodName(log.getFoodName());
        dto.setPortionSize(log.getPortionSize());
        dto.setPortionUnit(log.getPortionUnit());
        dto.setCalories(log.getCalories());
        dto.setProtein(log.getProtein());
        dto.setCarbohydrates(log.getCarbohydrates());
        dto.setFats(log.getFats());
        dto.setFiber(log.getFiber());
        dto.setSugar(log.getSugar());
        dto.setSodium(log.getSodium());
        dto.setNotes(log.getNotes());
        return dto;
    }
}