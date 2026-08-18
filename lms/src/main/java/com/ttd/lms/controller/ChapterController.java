package com.ttd.lms.controller;

import com.ttd.lms.entity.Role;
import com.ttd.lms.entity.User;
import com.ttd.lms.model.ChapterResponse;
import com.ttd.lms.model.CreateChapterRequest;
import com.ttd.lms.repository.CourseAssignmentRepository;
import com.ttd.lms.service.ChapterService;
import com.ttd.lms.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@SuppressWarnings("unused")
@Slf4j
@RestController
@RequestMapping("/api/courses/{courseId}/chapters")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterService chapterService;
    private final CourseService courseService;
    private final CourseAssignmentRepository courseAssignmentRepository;

    @PostMapping
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<ChapterResponse> addChapter(
            @PathVariable UUID courseId,
            @Valid @RequestBody CreateChapterRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID mentorId = user.getId();
        log.info("Adding chapter to course: {} by mentor: {}", courseId, mentorId);
        
        ChapterResponse response = chapterService.addChapter(courseId, mentorId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ChapterResponse>> getChaptersByCourse(
            @PathVariable UUID courseId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID userId = user.getId();
        log.info("Fetching chapters for course: {} by user: {}", courseId, userId);
        
        // Get user role from authorities
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .orElse("STUDENT");
        
        // Validate access: mentor owns course OR student is assigned
        if (role.equals("MENTOR")) {
            // Check if mentor owns this course
            if (!courseService.isCourseOwner(courseId, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else if (role.equals("STUDENT")) {
            // Check if student is assigned to this course
            if (!courseAssignmentRepository.existsByCourseIdAndStudentId(courseId, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        // Admin can access all
        
        List<ChapterResponse> chapters = chapterService.getChaptersByCourse(courseId);
        return ResponseEntity.ok(chapters);
    }
}
