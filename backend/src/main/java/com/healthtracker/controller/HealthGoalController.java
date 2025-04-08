package com.healthtracker.controller;

import com.healthtracker.dto.HealthGoalDto;
import com.healthtracker.model.HealthGoal;
import com.healthtracker.model.User;
import com.healthtracker.repository.HealthGoalRepository;
import com.healthtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/goals")
public class HealthGoalController {

    @Autowired
    private HealthGoalRepository healthGoalRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<HealthGoalDto>> getGoals(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<HealthGoal> goals = healthGoalRepository.findByUserIdOrderByStartDateDesc(user.getId());
        List<HealthGoalDto> goalDtos = goals.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(goalDtos);
    }

    @PostMapping
    public ResponseEntity<HealthGoalDto> createGoal(Authentication authentication, @RequestBody HealthGoalDto goalDto) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        HealthGoal goal = new HealthGoal();
        goal.setUser(user);
        goal.setGoalType(goalDto.getGoalType());
        goal.setDescription(goalDto.getDescription());
        goal.setStartDate(goalDto.getStartDate());
        goal.setTargetDate(goalDto.getTargetDate());
        goal.setTargetValue(goalDto.getTargetValue());
        goal.setUnit(goalDto.getUnit());
        goal.setCurrentValue(goalDto.getCurrentValue() != null ? goalDto.getCurrentValue() : 0.0);
        goal.setStatus("IN_PROGRESS");
        goal.setNotes(goalDto.getNotes());

        goal = healthGoalRepository.save(goal);

        return ResponseEntity.ok(convertToDto(goal));
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<HealthGoalDto> updateProgress(Authentication authentication,
            @PathVariable Long id, @RequestBody HealthGoalDto goalDto) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        HealthGoal goal = healthGoalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        goal.setCurrentValue(goalDto.getCurrentValue());
        goal = healthGoalRepository.save(goal);

        return ResponseEntity.ok(convertToDto(goal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(Authentication authentication, @PathVariable Long id) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        HealthGoal goal = healthGoalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        healthGoalRepository.delete(goal);
        return ResponseEntity.ok().build();
    }

    private HealthGoalDto convertToDto(HealthGoal goal) {
        HealthGoalDto dto = new HealthGoalDto();
        dto.setId(goal.getId());
        dto.setUserId(goal.getUser().getId());
        dto.setGoalType(goal.getGoalType());
        dto.setDescription(goal.getDescription());
        dto.setStartDate(goal.getStartDate());
        dto.setTargetDate(goal.getTargetDate());
        dto.setTargetValue(goal.getTargetValue());
        dto.setUnit(goal.getUnit());
        dto.setCurrentValue(goal.getCurrentValue());
        dto.setStatus(goal.getStatus());
        dto.setNotes(goal.getNotes());
        return dto;
    }
}