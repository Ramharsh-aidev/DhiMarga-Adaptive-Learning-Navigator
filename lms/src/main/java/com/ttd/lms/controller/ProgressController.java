package com.ttd.lms.controller;

import com.ttd.lms.entity.User;
import com.ttd.lms.model.ChapterProgressResponse;
import com.ttd.lms.model.CourseProgressResponse;
import com.ttd.lms.service.ProgressService;
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
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/chapters/{chapterId}/complete")
    public ResponseEntity<ChapterProgressResponse> completeChapter(
            @PathVariable UUID chapterId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID studentId = user.getId();
        log.info("Completing chapter: {} by student: {}", chapterId, studentId);
        
        ChapterProgressResponse response = progressService.completeChapter(chapterId, studentId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/track-time/{chapterId}")
    public ResponseEntity<java.util.Map<String, String>> trackTime(
            @PathVariable UUID chapterId,
            @RequestParam Long timeSpentSeconds,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID studentId = user.getId();
        log.info("Tracking time for chapter: {} by student: {}, time: {}s", chapterId, studentId, timeSpentSeconds);
        
        progressService.updateTimeSpent(studentId, chapterId, timeSpentSeconds);
        return ResponseEntity.ok(java.util.Map.of("message", "Time tracked successfully"));
    }

    @GetMapping("/my")
    public ResponseEntity<List<CourseProgressResponse>> getMyProgress(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID studentId = user.getId();
        log.info("Fetching progress for student: {}", studentId);
        
        List<CourseProgressResponse> progress = progressService.getMyProgress(studentId);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<CourseProgressResponse> getCourseProgress(
            @PathVariable UUID courseId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID studentId = user.getId();
        log.info("Fetching course progress for course: {} by student: {}", courseId, studentId);
        
        CourseProgressResponse response = progressService.getCourseProgress(courseId, studentId);
        return ResponseEntity.ok(response);
    }
}
