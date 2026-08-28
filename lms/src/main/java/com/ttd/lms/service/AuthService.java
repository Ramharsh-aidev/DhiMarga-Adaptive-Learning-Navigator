package com.ttd.lms.service;

import com.ttd.lms.config.JwtUtil;
import com.ttd.lms.entity.ApprovalStatus;
import com.ttd.lms.entity.Role;
import com.ttd.lms.entity.User;
import com.ttd.lms.exception.DuplicateResourceException;
import com.ttd.lms.exception.UnauthorizedException;
import com.ttd.lms.model.AuthResponse;
import com.ttd.lms.model.LoginRequest;
import com.ttd.lms.model.RegisterRequest;
import com.ttd.lms.model.UserResponse;
import com.ttd.lms.repository.UserRepository;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;


    @SuppressWarnings("null")
    @Transactional
    public AuthResponse register(@NonNull RegisterRequest request) {
        log.info("Attempting to register new user with email: {} and role: {}", request.getEmail(), request.getRole());

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        // Determine role and approval status
        Role role = (request.getRole() != null) ? request.getRole() : Role.STUDENT;
        ApprovalStatus approvalStatus = (role == Role.STUDENT) ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING;

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .approvalStatus(approvalStatus)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Successfully registered {} with approval status: {}", savedUser.getRole(), approvalStatus);

        // Build response with user details
        UserResponse userResponse = buildUserResponse(savedUser);
        
        // For mentors pending approval, return response without token
        if (role == Role.MENTOR && approvalStatus != ApprovalStatus.APPROVED) {
            log.info("Mentor registration successful but pending approval: {}", savedUser.getEmail());
            return AuthResponse.builder()
                    .token(null)
                    .user(userResponse)
                    .build();
        }

        // For approved users (students), generate JWT token
        String token = jwtUtil.generateToken(savedUser, savedUser.getId().toString(), savedUser.getRole().name());
        return new AuthResponse(token, userResponse);
    }

    @Transactional
    public AuthResponse login(@NonNull LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();

            // Update Streak Logic
            java.time.LocalDate today = java.time.LocalDate.now();
            if (user.getLastActiveDate() == null || user.getLastActiveDate().isBefore(today.minusDays(1))) {
                user.setCurrentStreak(1);
            } else if (user.getLastActiveDate().isEqual(today.minusDays(1))) {
                user.setCurrentStreak((user.getCurrentStreak() == null ? 0 : user.getCurrentStreak()) + 1);
            }
            user.setLastActiveDate(today);
            userRepository.save(user);

            // Check if mentor is approved
            if (user.getRole() == Role.MENTOR && user.getApprovalStatus() != ApprovalStatus.APPROVED) {
                log.warn("Unapproved mentor attempted login: {}", user.getEmail());
                throw new UnauthorizedException("Your mentor account is pending approval");
            }

            log.info("Successful login for user: {} with role: {}", user.getEmail(), user.getRole());

            // Generate JWT token
            String token = jwtUtil.generateToken(user, user.getId().toString(), user.getRole().name());

            // Build response
            UserResponse userResponse = buildUserResponse(user);
            return new AuthResponse(token, userResponse);

        } catch (AuthenticationException e) {
            log.error("Authentication failed for email: {}", request.getEmail());
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    @Transactional(readOnly = true)
    public UserResponse validateToken(@NonNull String token) {
        try {
            String email = jwtUtil.extractUsername(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UnauthorizedException("Invalid token"));

            return buildUserResponse(user);
        } catch (Exception e) {
            log.error("Token validation failed", e);
            throw new UnauthorizedException("Invalid or expired token");
        }
    }

    private UserResponse buildUserResponse(@NonNull User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .approvalStatus(user.getApprovalStatus())
                .createdAt(user.getCreatedAt())
                .currentStreak(user.getCurrentStreak() != null ? user.getCurrentStreak() : 0)
                .build();
    }
}
