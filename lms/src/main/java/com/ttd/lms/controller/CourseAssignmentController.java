package com.ttd.lms.controller;

import com.ttd.lms.entity.Role;
import com.ttd.lms.entity.User;
import com.ttd.lms.model.AssignCourseRequest;
import com.ttd.lms.service.CourseAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MENTOR')")
public class CourseAssignmentController {

    private final CourseAssignmentService courseAssignmentService;

    @PostMapping("/{courseId}/assign")
    public ResponseEntity<String> assignCourse(
            @PathVariable UUID courseId,
            @Valid @RequestBody AssignCourseRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID mentorId = user.getId();
        log.info("Assigning course: {} to students by mentor: {}", courseId, mentorId);
        
        // Assign course to each student in the list
        for (UUID studentId : request.getStudentIds()) {
            courseAssignmentService.assignCourse(courseId, studentId, mentorId, Role.MENTOR);
        }
        
        String message = String.format("Successfully assigned course to %d student(s)", 
                request.getStudentIds().size());
        return ResponseEntity.ok(message);
    }
}
