package com.ttd.lms.service;

import com.ttd.lms.entity.Chapter;
import com.ttd.lms.entity.Course;
import com.ttd.lms.entity.Progress;
import com.ttd.lms.entity.Role;
import com.ttd.lms.entity.User;
import com.ttd.lms.exception.BadRequestException;
import com.ttd.lms.exception.ForbiddenException;
import com.ttd.lms.exception.ResourceNotFoundException;
import com.ttd.lms.model.ChapterProgressResponse;
import com.ttd.lms.model.CourseProgressResponse;
import com.ttd.lms.repository.ChapterRepository;
import com.ttd.lms.repository.CourseAssignmentRepository;
import com.ttd.lms.repository.CourseRepository;
import com.ttd.lms.repository.ProgressRepository;
import com.ttd.lms.repository.UserRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;
    private final CourseAssignmentRepository courseAssignmentRepository;
    private final UserRepository userRepository;

    /*Mark a chapter as complete with sequential validation Students must complete chapters in order */
    @Transactional
    public ChapterProgressResponse completeChapter(@NonNull UUID chapterId, @NonNull UUID studentId) {
        log.info("Marking chapter {} as complete for student: {}", chapterId, studentId);

        // Validate student exists and has STUDENT role
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("Only students can complete chapters");
        }

        // Validate chapter exists
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        UUID courseId = chapter.getCourseId();

        // Validate course is assigned to student
        if (!courseAssignmentRepository.existsByCourseIdAndStudentId(courseId, studentId)) {
            throw new ForbiddenException("You must be assigned to this course to complete chapters");
        }

        // Check if already completed
        if (progressRepository.isChapterCompletedByUser(studentId, chapterId)) {
            log.info("Chapter {} already completed by student {}", chapterId, studentId);
            Progress existingProgress = progressRepository.findByUserIdAndChapterId(studentId, chapterId)
                    .orElseThrow(() -> new ResourceNotFoundException("Progress not found"));
            return buildChapterProgressResponse(existingProgress, chapter);
        }

        // SEQUENTIAL VALIDATION: Check if previous chapters are completed
        if (chapter.getSequenceOrder() > 1) {
            boolean hasCompletedPrevious = progressRepository.hasCompletedPreviousChapters(
                    studentId, courseId, chapter.getSequenceOrder()
            );

            if (!hasCompletedPrevious) {
                throw new BadRequestException("You must complete previous chapters before this one");
            }
        }

        // Find or create progress record
        Progress progress = progressRepository.findByUserIdAndChapterId(studentId, chapterId)
                .orElse(Progress.builder()
                        .userId(studentId)
                        .chapterId(chapterId)
                        .courseId(courseId)
                        .isCompleted(false)
                        .build());

        // Mark as completed
        progress.setIsCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        Progress savedProgress = progressRepository.save(progress);

        log.info("Chapter {} marked as complete for student {}", chapterId, studentId);

        return buildChapterProgressResponse(savedProgress, chapter);
    }

    /* Start a chapter for a student */
    @Transactional
    public ChapterProgressResponse startChapter(@NonNull UUID chapterId, @NonNull UUID studentId) {
        log.info("Starting chapter {} for student: {}", chapterId, studentId);

        // Validate student exists
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("Only students can start chapters");
        }

        // Validate chapter exists
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        UUID courseId = chapter.getCourseId();

        // Validate course is assigned to student
        if (!courseAssignmentRepository.existsByCourseIdAndStudentId(courseId, studentId)) {
            throw new ForbiddenException("You must be assigned to this course to access chapters");
        }

        // Check if already started
        Optional<Progress> existingProgress = progressRepository.findByUserIdAndChapterId(studentId, chapterId);
        if (existingProgress.isPresent()) {
            return buildChapterProgressResponse(existingProgress.get(), chapter);
        }

        // Create progress record
        Progress progress = Progress.builder()
                .userId(studentId)
                .chapterId(chapterId)
                .courseId(courseId)
                .isCompleted(false)
                .build();

        @SuppressWarnings("null")
        Progress savedProgress = progressRepository.save(progress);
        log.info("Chapter {} started for student {}", chapterId, studentId);

        return buildChapterProgressResponse(savedProgress, chapter);
    }

    /* Get course progress for a student */
    @Transactional(readOnly = true)
    public CourseProgressResponse getCourseProgress(@NonNull UUID courseId, @NonNull UUID studentId) {
        log.info("Fetching course progress for course: {} and student: {}", courseId, studentId);

        // Validate course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Validate student exists
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("Only students have course progress");
        }

        // Validate course is assigned to student
        if (!courseAssignmentRepository.existsByCourseIdAndStudentId(courseId, studentId)) {
            throw new ForbiddenException("You must be assigned to this course to view progress");
        }

        // Get all chapters for the course
        List<Chapter> chapters = chapterRepository.findByCourseIdOrderBySequenceOrderAsc(courseId);

        // Get progress records for this student and course
        List<Progress> progressList = progressRepository.findByUserIdAndCourseIdOrderByChapter_SequenceOrderAsc(studentId, courseId);

        // Calculate completion statistics
        int totalChapters = chapters.size();
        long completedChapters = progressList.stream()
                .filter(p -> p.getCompletedAt() != null)
                .count();

        double completionPercentage = totalChapters > 0
                ? ((double) completedChapters / totalChapters) * 100
                : 0.0;

        // Build chapter progress list
        List<ChapterProgressResponse> chapterProgressList = chapters.stream()
                .map(chapter -> {
                    Progress progress = progressList.stream()
                            .filter(p -> p.getChapterId().equals(chapter.getId()))
                            .findFirst()
                            .orElse(null);

                    return buildChapterProgressResponse(progress, chapter);
                })
                .collect(Collectors.toList());

        return CourseProgressResponse.builder()
                .courseId(courseId)
                .courseTitle(course.getTitle())
                .studentId(studentId)
                .studentName(student.getName())
                .totalChapters(totalChapters)
                .completedChapters((int) completedChapters)
                .completionPercentage(completionPercentage)
                .chapters(chapterProgressList)
                .build();
    }

    @Transactional(readOnly = true)
    public List<CourseProgressResponse> getMyProgress(@NonNull UUID studentId) {
        log.info("Fetching all progress for student: {}", studentId);

        // Validate student exists
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("Only students have progress records");
        }

        // Get all courses assigned to the student
        List<Course> assignedCourses = courseRepository.findAssignedToStudent(studentId);

        // Handle no courses assigned
        if (assignedCourses == null || assignedCourses.isEmpty()) {
            log.info("No courses assigned to student: {}", studentId);
            return List.of();
        }

        // Build progress for each course
        return assignedCourses.stream()
                .map(course -> getCourseProgress(course.getId(), studentId))
                .collect(Collectors.toList());
    }

    /* Check if a chapter is unlocked for a student (sequential logic) */
    @Transactional(readOnly = true)
    public boolean isChapterUnlocked(@NonNull UUID chapterId, @NonNull UUID studentId) {
        log.info("Checking if chapter {} is unlocked for student: {}", chapterId, studentId);

        // Validate chapter exists
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        // First chapter is always unlocked
        if (chapter.getSequenceOrder() == 1) {
            return true;
        }

        // Check if previous chapters are completed
        return progressRepository.hasCompletedPreviousChapters(
                studentId, chapter.getCourseId(), chapter.getSequenceOrder()
        );
    }

    /* Check if a course is completed by a student */
    @Transactional(readOnly = true)
    public boolean isCourseCompleted(@NonNull UUID courseId, @NonNull UUID studentId) {
        log.info("Checking if course {} is completed by student: {}", courseId, studentId);

        return progressRepository.isCourseCompleted(studentId, courseId);
    }

    /* Get completion percentage for a course */
    @Transactional(readOnly = true)
    public double getCompletionPercentage(@NonNull UUID courseId, @NonNull UUID studentId) {
        log.info("Calculating completion percentage for course: {} and student: {}", courseId, studentId);

        // Get total chapters
        long totalChapters = chapterRepository.countByCourseId(courseId);

        if (totalChapters == 0) {
            return 0.0;
        }

        // Get completed chapters
        long completedChapters = progressRepository.countByUserIdAndCourseIdAndIsCompletedTrue(studentId, courseId);

        return ((double) completedChapters / totalChapters) * 100;
    }

    /* Build ChapterProgressResponse */
    private ChapterProgressResponse buildChapterProgressResponse(Progress progress, Chapter chapter) {
        boolean isCompleted = progress != null && progress.getIsCompleted() != null && progress.getIsCompleted();
        boolean isStarted = progress != null && progress.getStartedAt() != null;

        return ChapterProgressResponse.builder()
                .chapterId(chapter.getId())
                .chapterTitle(chapter.getTitle())
                .sequenceOrder(chapter.getSequenceOrder())
                .isCompleted(isCompleted)
                .isStarted(isStarted)
                .startedAt(progress != null ? progress.getStartedAt() : null)
                .completedAt(progress != null ? progress.getCompletedAt() : null)
                .build();
    }

    /* Update time spent on a chapter */
    @Transactional
    public void updateTimeSpent(@NonNull UUID studentId, @NonNull UUID chapterId, @NonNull Long additionalTimeSeconds) {
        log.info("Updating time spent for chapter {} by student: {}, adding {}s", chapterId, studentId, additionalTimeSeconds);

        // Find or create progress record
        Progress progress = progressRepository.findByUserIdAndChapterId(studentId, chapterId)
                .orElseGet(() -> {
                    // Validate chapter exists
                    Chapter chapter = chapterRepository.findById(chapterId)
                            .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));
                    
                    return Progress.builder()
                            .userId(studentId)
                            .chapterId(chapterId)
                            .courseId(chapter.getCourseId())
                            .isCompleted(false)
                            .timeSpentSeconds(0L)
                            .build();
                });

        // Update time spent and last accessed
        Long currentTime = progress.getTimeSpentSeconds() != null ? progress.getTimeSpentSeconds() : 0L;
        progress.setTimeSpentSeconds(currentTime + additionalTimeSeconds);
        progress.setLastAccessedAt(LocalDateTime.now());
        
        progressRepository.save(progress);
        log.info("Time updated for chapter {} by student {}: total time {}s", chapterId, studentId, progress.getTimeSpentSeconds());
    }
}
