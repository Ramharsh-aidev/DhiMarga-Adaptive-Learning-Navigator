package com.ttd.lms.controller;

import com.ttd.lms.entity.User;
import com.ttd.lms.model.CourseAnalyticsResponse;
import com.ttd.lms.model.CourseResponse;
import com.ttd.lms.model.CreateCourseRequest;
import com.ttd.lms.model.StudentProgressSummary;
import com.ttd.lms.model.UpdateCourseRequest;
import com.ttd.lms.service.AnalyticsService;
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

@Slf4j
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MENTOR')")
public class CourseController {

    private final CourseService courseService;
    private final AnalyticsService analyticsService;

    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(
            @Valid @RequestBody CreateCourseRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID mentorId = user.getId();
        log.info("Creating course for mentor: {}", mentorId);
        
        CourseResponse response = courseService.createCourse(mentorId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<CourseResponse>> getMyCourses(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID mentorId = user.getId();
        log.info("Fetching courses for mentor: {}", mentorId);
        
        List<CourseResponse> courses = courseService.getMyCourses(mentorId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(
            @PathVariable UUID id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID mentorId = user.getId();
        log.info("Fetching course: {} by mentor: {}", id, mentorId);
        
        CourseResponse response = courseService.getCourseById(id, mentorId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCourseRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID mentorId = user.getId();
        log.info("Updating course: {} by mentor: {}", id, mentorId);
        
        CourseResponse response = courseService.updateCourse(id, mentorId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable UUID id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID mentorId = user.getId();
        log.info("Deleting course: {} by mentor: {}", id, mentorId);
        
        courseService.deleteCourse(id, mentorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<CourseAnalyticsResponse> getCourseAnalytics(
            @PathVariable UUID id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID mentorId = user.getId();
        log.info("Fetching analytics for course: {} by mentor: {}", id, mentorId);
        
        CourseAnalyticsResponse analytics = analyticsService.getCourseAnalytics(id, mentorId);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/{id}/analytics/students")
    public ResponseEntity<List<StudentProgressSummary>> getStudentProgress(
            @PathVariable UUID id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID mentorId = user.getId();
        log.info("Fetching student progress for course: {} by mentor: {}", id, mentorId);
        
        List<StudentProgressSummary> studentProgress = analyticsService.getStudentProgressSummaries(id, mentorId);
        return ResponseEntity.ok(studentProgress);
    }
}

