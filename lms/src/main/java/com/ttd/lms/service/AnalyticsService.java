package com.ttd.lms.service;

import com.ttd.lms.entity.Chapter;
import com.ttd.lms.entity.Course;
import com.ttd.lms.entity.CourseAssignment;
import com.ttd.lms.entity.Progress;
import com.ttd.lms.exception.ForbiddenException;
import com.ttd.lms.exception.ResourceNotFoundException;
import com.ttd.lms.model.ChapterAnalyticsResponse;
import com.ttd.lms.model.CourseAnalyticsResponse;
import com.ttd.lms.model.StudentProgressSummary;
import com.ttd.lms.repository.ChapterRepository;
import com.ttd.lms.repository.CourseAssignmentRepository;
import com.ttd.lms.repository.CourseRepository;
import com.ttd.lms.repository.ProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final ProgressRepository progressRepository;
    private final CourseAssignmentRepository assignmentRepository;

    public CourseAnalyticsResponse getCourseAnalytics(UUID courseId, UUID mentorId) {
        // Verify mentor owns the course
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        if (!course.getMentorId().equals(mentorId)) {
            throw new ForbiddenException("Unauthorized: You can only view analytics for your own courses");
        }

        // Get all assigned students for this course
        List<CourseAssignment> assignments = assignmentRepository.findByCourseId(courseId);
        int totalStudents = assignments.size();

        if (totalStudents == 0) {
            return CourseAnalyticsResponse.builder()
                    .courseId(courseId)
                    .courseTitle(course.getTitle())
                    .totalStudents(0)
                    .studentsNotStarted(0)
                    .studentsInProgress(0)
                    .studentsCompleted(0)
                    .completionRate(0.0)
                    .averageProgress(0.0)
                    .chapterAnalytics(Collections.emptyList())
                    .averageTimeToCompleteSeconds(0L)
                    .lastUpdated(LocalDateTime.now())
                    .build();
        }

        // Get all progress records for this course
        List<Progress> allProgress = progressRepository.findByCourseId(courseId);
        
        // Get total chapters in course
        List<Chapter> chapters = chapterRepository.findByCourseIdOrderBySequenceOrderAsc(courseId);
        int totalChapters = chapters.size();

        // Calculate student status
        Set<UUID> studentIds = assignments.stream()
                .map(CourseAssignment::getStudentId)
                .collect(Collectors.toSet());

        int studentsNotStarted = 0;
        int studentsInProgress = 0;
        int studentsCompleted = 0;
        double totalProgressSum = 0.0;
        long totalTimeSum = 0L;
        int completedCoursesCount = 0;

        for (UUID studentId : studentIds) {
            List<Progress> studentProgress = allProgress.stream()
                    .filter(p -> p.getUserId().equals(studentId))
                    .collect(Collectors.toList());

            if (studentProgress.isEmpty()) {
                studentsNotStarted++;
                continue;
            }

            long completedCount = studentProgress.stream()
                    .filter(Progress::getIsCompleted)
                    .count();

            double progressPercentage = (completedCount * 100.0) / totalChapters;
            totalProgressSum += progressPercentage;

            if (completedCount == 0) {
                studentsNotStarted++;
            } else if (completedCount == totalChapters) {
                studentsCompleted++;
                completedCoursesCount++;
                
                // Calculate time to complete for this student
                long studentTimeSpent = studentProgress.stream()
                        .mapToLong(p -> p.getTimeSpentSeconds() != null ? p.getTimeSpentSeconds() : 0L)
                        .sum();
                totalTimeSum += studentTimeSpent;
            } else {
                studentsInProgress++;
            }
        }

        double completionRate = (studentsCompleted * 100.0) / totalStudents;
        double averageProgress = totalProgressSum / totalStudents;
        long averageTimeToComplete = completedCoursesCount > 0 ? totalTimeSum / completedCoursesCount : 0L;

        // Get chapter-wise analytics
        List<ChapterAnalyticsResponse> chapterAnalytics = getChapterAnalytics(courseId, studentIds, allProgress, totalStudents);

        return CourseAnalyticsResponse.builder()
                .courseId(courseId)
                .courseTitle(course.getTitle())
                .totalStudents(totalStudents)
                .studentsNotStarted(studentsNotStarted)
                .studentsInProgress(studentsInProgress)
                .studentsCompleted(studentsCompleted)
                .completionRate(completionRate)
                .averageProgress(averageProgress)
                .chapterAnalytics(chapterAnalytics)
                .averageTimeToCompleteSeconds(averageTimeToComplete)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    private List<ChapterAnalyticsResponse> getChapterAnalytics(UUID courseId, Set<UUID> studentIds, 
                                                               List<Progress> allProgress, int totalStudents) {
        List<Chapter> chapters = chapterRepository.findByCourseIdOrderBySequenceOrderAsc(courseId);
        
        return chapters.stream().map(chapter -> {
            List<Progress> chapterProgress = allProgress.stream()
                    .filter(p -> p.getChapterId().equals(chapter.getId()))
                    .collect(Collectors.toList());

            int studentsStarted = chapterProgress.size();
            int studentsCompleted = (int) chapterProgress.stream()
                    .filter(Progress::getIsCompleted)
                    .count();
            int dropOffCount = studentsStarted - studentsCompleted;

            double completionRate = totalStudents > 0 ? (studentsCompleted * 100.0) / totalStudents : 0.0;

            // Calculate average time to complete
            long avgTime = (long) chapterProgress.stream()
                    .filter(Progress::getIsCompleted)
                    .filter(p -> p.getTimeSpentSeconds() != null && p.getTimeSpentSeconds() > 0)
                    .mapToLong(Progress::getTimeSpentSeconds)
                    .average()
                    .orElse(0.0);

            return ChapterAnalyticsResponse.builder()
                    .chapterId(chapter.getId().toString())
                    .chapterTitle(chapter.getTitle())
                    .sequenceOrder(chapter.getSequenceOrder())
                    .totalStudents(totalStudents)
                    .studentsStarted(studentsStarted)
                    .studentsCompleted(studentsCompleted)
                    .completionRate(completionRate)
                    .averageTimeToCompleteSeconds(avgTime)
                    .dropOffCount(dropOffCount)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<StudentProgressSummary> getStudentProgressSummaries(UUID courseId, UUID mentorId) {
        // Verify mentor owns the course
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        if (!course.getMentorId().equals(mentorId)) {
            throw new ForbiddenException("Unauthorized: You can only view analytics for your own courses");
        }

        // Get all assigned students
        List<CourseAssignment> assignments = assignmentRepository.findByCourseId(courseId);
        
        // Get total chapters
        int totalChapters = (int) chapterRepository.countByCourseId(courseId);

        // Get all progress for course
        List<Progress> allProgress = progressRepository.findByCourseId(courseId);

        return assignments.stream().map(assignment -> {
            UUID studentId = assignment.getStudentId();
            
            List<Progress> studentProgress = allProgress.stream()
                    .filter(p -> p.getUserId().equals(studentId))
                    .collect(Collectors.toList());

            int completedChapters = (int) studentProgress.stream()
                    .filter(Progress::getIsCompleted)
                    .count();
            
            int inProgressChapters = (int) studentProgress.stream()
                    .filter(p -> !p.getIsCompleted())
                    .count();
            
            int notStartedChapters = totalChapters - studentProgress.size();

            double progressPercentage = totalChapters > 0 ? (completedChapters * 100.0) / totalChapters : 0.0;

            long totalTimeSpent = studentProgress.stream()
                    .mapToLong(p -> p.getTimeSpentSeconds() != null ? p.getTimeSpentSeconds() : 0L)
                    .sum();

            LocalDateTime lastAccessed = studentProgress.stream()
                    .map(Progress::getLastAccessedAt)
                    .filter(Objects::nonNull)
                    .max(LocalDateTime::compareTo)
                    .orElse(null);

            LocalDateTime firstStarted = studentProgress.stream()
                    .map(Progress::getStartedAt)
                    .min(LocalDateTime::compareTo)
                    .orElse(null);

            LocalDateTime lastCompleted = studentProgress.stream()
                    .filter(Progress::getIsCompleted)
                    .map(Progress::getCompletedAt)
                    .filter(Objects::nonNull)
                    .max(LocalDateTime::compareTo)
                    .orElse(null);

            // Calculate learning velocity (chapters per day)
            Double learningVelocity = null;
            if (firstStarted != null && completedChapters > 0) {
                long daysSinceStart = ChronoUnit.DAYS.between(firstStarted, LocalDateTime.now());
                if (daysSinceStart > 0) {
                    learningVelocity = completedChapters / (double) daysSinceStart;
                }
            }

            return StudentProgressSummary.builder()
                    .studentId(studentId)
                    .studentName(assignment.getStudent().getName())
                    .studentEmail(assignment.getStudent().getEmail())
                    .totalChapters(totalChapters)
                    .completedChapters(completedChapters)
                    .inProgressChapters(inProgressChapters)
                    .notStartedChapters(notStartedChapters)
                    .progressPercentage(progressPercentage)
                    .totalTimeSpentSeconds(totalTimeSpent)
                    .lastAccessedAt(lastAccessed)
                    .enrolledAt(assignment.getAssignedAt())
                    .firstChapterStartedAt(firstStarted)
                    .lastChapterCompletedAt(lastCompleted)
                    .learningVelocity(learningVelocity)
                    .build();
        }).collect(Collectors.toList());
    }
}
