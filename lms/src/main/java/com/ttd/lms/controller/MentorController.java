package com.ttd.lms.controller;

import com.ttd.lms.entity.Role;
import com.ttd.lms.entity.User;
import com.ttd.lms.model.StudentEnrollmentResponse;
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
@RequestMapping("/api/mentor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MENTOR')")
public class MentorController {

    private final UserService userService;

    /**
     * Get all students (mentor only)
     * This endpoint allows mentors to fetch students for course assignment
     * GET /api/mentor/students
     */
    @GetMapping("/students")
    public ResponseEntity<List<UserResponse>> getAllStudents(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        log.info("Mentor {} requesting all students", user.getId());
        
        List<UserResponse> students = userService.getUsersByRole(Role.STUDENT);
        return ResponseEntity.ok(students);
    }

    /**
     * Get students with enrollment status for a specific course
     * GET /api/mentor/students/for-course/{courseId}
     */
    @GetMapping("/students/for-course/{courseId}")
    public ResponseEntity<List<StudentEnrollmentResponse>> getStudentsForCourse(
            @PathVariable UUID courseId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID mentorId = user.getId();
        log.info("Mentor {} requesting students with enrollment status for course: {}", mentorId, courseId);
        
        List<StudentEnrollmentResponse> students = userService.getStudentsWithEnrollmentStatus(courseId, mentorId);
        return ResponseEntity.ok(students);
    }
}
