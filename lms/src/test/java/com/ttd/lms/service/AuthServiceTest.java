package com.ttd.lms.service;

import com.ttd.lms.entity.User;
import com.ttd.lms.entity.Role;
import com.ttd.lms.repository.UserRepository;
import com.ttd.lms.model.LoginRequest;
import com.ttd.lms.config.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @Test
    void login_ShouldIncrementStreak_WhenLoggedYesterday() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("password");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@test.com");
        user.setRole(Role.STUDENT);
        user.setLastActiveDate(LocalDate.now().minusDays(1)); // Logged in yesterday
        user.setCurrentStreak(5);

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(user);
        when(authenticationManager.authenticate(any())).thenReturn(auth);

        when(jwtUtil.generateToken(any(), anyString(), anyString())).thenReturn("dummy-token");

        // Act
        authService.login(request);

        // Assert
        assertEquals(6, user.getCurrentStreak(), "Streak should increment by 1");
        assertEquals(LocalDate.now(), user.getLastActiveDate(), "Last active date should be today");
        verify(userRepository).save(user);
    }

    @Test
    void login_ShouldResetStreak_WhenLoggedBeforeYesterday() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("password");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@test.com");
        user.setRole(Role.STUDENT);
        user.setLastActiveDate(LocalDate.now().minusDays(2)); // Logged in 2 days ago
        user.setCurrentStreak(5);

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(user);
        when(authenticationManager.authenticate(any())).thenReturn(auth);

        when(jwtUtil.generateToken(any(), anyString(), anyString())).thenReturn("dummy-token");

        // Act
        authService.login(request);

        // Assert
        assertEquals(1, user.getCurrentStreak(), "Streak should reset to 1");
        assertEquals(LocalDate.now(), user.getLastActiveDate(), "Last active date should be today");
        verify(userRepository).save(user);
    }
}
