package com.healthtracker.service;

import com.healthtracker.dto.AuthResponse;
import com.healthtracker.dto.LoginRequest;
import com.healthtracker.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void logout(String token);
}