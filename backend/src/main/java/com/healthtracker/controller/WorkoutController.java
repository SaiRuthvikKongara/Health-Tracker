package com.healthtracker.controller;

import com.healthtracker.dto.WorkoutDto;
import com.healthtracker.model.Workout;
import com.healthtracker.model.User;
import com.healthtracker.repository.WorkoutRepository;
import com.healthtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<WorkoutDto>> getWorkouts(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Workout> workouts = workoutRepository.findByUserIdOrderByDateDesc(user.getId());
        List<WorkoutDto> workoutDtos = workouts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(workoutDtos);
    }

    @PostMapping
    public ResponseEntity<WorkoutDto> createWorkout(Authentication authentication, @RequestBody WorkoutDto workoutDto) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Workout workout = new Workout();
        workout.setUser(user);
        workout.setDate(workoutDto.getDate());
        workout.setWorkoutType(workoutDto.getWorkoutType());
        workout.setDuration(workoutDto.getDuration());
        workout.setCaloriesBurned(workoutDto.getCaloriesBurned());

        workout = workoutRepository.save(workout);

        return ResponseEntity.ok(convertToDto(workout));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(Authentication authentication, @PathVariable Long id) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (!workout.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        workoutRepository.delete(workout);
        return ResponseEntity.ok().build();
    }

    private WorkoutDto convertToDto(Workout workout) {
        WorkoutDto dto = new WorkoutDto();
        dto.setId(workout.getId());
        dto.setUserId(workout.getUser().getId());
        dto.setDate(workout.getDate());
        dto.setWorkoutType(workout.getWorkoutType());
        dto.setDuration(workout.getDuration());
        dto.setCaloriesBurned(workout.getCaloriesBurned());
        return dto;
    }
}