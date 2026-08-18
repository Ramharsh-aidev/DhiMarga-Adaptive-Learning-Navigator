package com.ttd.lms.controller;

import com.ttd.lms.entity.Role;
import com.ttd.lms.entity.User;
import com.ttd.lms.model.UserManagementResponse;
import com.ttd.lms.model.UserResponse;
import com.ttd.lms.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    /**
     * Get all users (admin only)
     * GET /api/admin/users
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false) Role role) {
        log.info("Admin request to get all users, role filter: {}", role);
        
        if (role != null) {
            List<UserResponse> users = userService.getUsersByRole(role);
            return ResponseEntity.ok(users);
        } else {
            List<UserManagementResponse> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        }
    }

    /**
     * Get user by ID (admin only)
     * GET /api/admin/users/:id
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        log.info("Admin request to get user: {}", id);
        
        UserResponse user = userService.getUserById(id);
        
        return ResponseEntity.ok(user);
    }

    /**
     * Approve mentor account (admin only)
     * PUT /api/admin/users/:id/approve-mentor
     */
    @PutMapping("/users/{id}/approve-mentor")
    public ResponseEntity<UserResponse> approveMentor(@PathVariable UUID id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID adminId = user.getId();
        log.info("Admin {} approving mentor: {}", adminId, id);
        
        UserResponse approvedUser = userService.approveMentor(id, true);
        
        log.info("Mentor approved successfully: {}", id);
        return ResponseEntity.ok(approvedUser);
    }

    /**
     * Delete user (admin only)
     * DELETE /api/admin/users/:id
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID adminId = user.getId();
        log.info("Admin {} deleting user: {}", adminId, id);
        
        userService.deleteUser(id);
        
        log.info("User deleted successfully: {}", id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all pending mentor approvals (admin only)
     * GET /api/admin/mentors/pending
     */
    @GetMapping("/mentors/pending")
    public ResponseEntity<List<UserResponse>> getPendingMentors() {
        log.info("Admin request for pending mentor approvals");
        
        List<UserResponse> pendingMentors = userService.getPendingMentors();
        
        return ResponseEntity.ok(pendingMentors);
    }
}
