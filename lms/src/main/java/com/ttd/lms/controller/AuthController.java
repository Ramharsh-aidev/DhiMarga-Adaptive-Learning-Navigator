package com.ttd.lms.controller;

import com.ttd.lms.model.AuthResponse;
import com.ttd.lms.model.LoginRequest;
import com.ttd.lms.model.RegisterRequest;
import com.ttd.lms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new student (public endpoint)
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request received for email: {}", request.getEmail());
        
        AuthResponse response = authService.register(request);
        
        log.info("User registered successfully: {}", response.getUser().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Login for all users (students, mentors, admins)
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email: {}", request.getEmail());
        
        AuthResponse response = authService.login(request);
        
        log.info("User logged in successfully: {}", response.getUser().getEmail());
        return ResponseEntity.ok(response);
    }

    /**
     * Validate JWT token
     * GET /api/auth/validate
     */
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken() {
        log.info("Token validation request received");
        return ResponseEntity.ok("Token is valid");
    }
}
