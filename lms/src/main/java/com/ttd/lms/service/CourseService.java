package com.ttd.lms.service;

import com.ttd.lms.entity.ApprovalStatus;
import com.ttd.lms.entity.Course;
import com.ttd.lms.entity.Role;
import com.ttd.lms.entity.User;
import com.ttd.lms.exception.BadRequestException;
import com.ttd.lms.exception.ForbiddenException;
import com.ttd.lms.exception.ResourceNotFoundException;
import com.ttd.lms.model.ChapterResponse;
import com.ttd.lms.model.CourseDetailResponse;
import com.ttd.lms.model.CourseResponse;
import com.ttd.lms.model.CreateCourseRequest;
import com.ttd.lms.model.UpdateCourseRequest;
import com.ttd.lms.repository.ChapterRepository;
import com.ttd.lms.repository.CourseAssignmentRepository;
import com.ttd.lms.repository.CourseRepository;
import com.ttd.lms.repository.UserRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;
    private final CourseAssignmentRepository courseAssignmentRepository;

    @Transactional
    public CourseResponse createCourse(@NonNull UUID mentorId, @NonNull CreateCourseRequest request) {
        log.info("Creating new course by mentor: {}", mentorId);

        // Validate mentor exists and is approved
        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        if (mentor.getRole() != Role.MENTOR) {
            throw new ForbiddenException("Only mentors can create courses");
        }

        if (mentor.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new ForbiddenException("Mentor account is not approved");
        }

        // Validate course title
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Course title is required");
        }

        // Create course
        Course course = Course.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .mentorId(mentorId)
                .build();

        @SuppressWarnings("null")
        @NonNull Course savedCourse = courseRepository.save(course);
        log.info("Course created successfully: {} by mentor: {}", savedCourse.getId(), mentorId);

        return buildCourseResponse(savedCourse, mentor);
    }

    @Transactional
    public CourseResponse updateCourse(@NonNull UUID courseId, @NonNull UUID mentorId, 
                                       @NonNull UpdateCourseRequest request) {
        log.info("Updating course: {} by mentor: {}", courseId, mentorId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Check ownership
        if (!course.getMentorId().equals(mentorId)) {
            throw new ForbiddenException("You can only update your own courses");
        }

        // Update fields
        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            course.setTitle(request.getTitle().trim());
        }

        if (request.getDescription() != null) {
            course.setDescription(request.getDescription());
        }

        @NonNull Course updatedCourse = courseRepository.save(course);
        log.info("Course updated successfully: {}", courseId);

        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        return buildCourseResponse(updatedCourse, mentor);
    }

    @Transactional
    public void deleteCourse(@NonNull UUID courseId, @NonNull UUID mentorId) {
        log.info("Deleting course: {} by mentor: {}", courseId, mentorId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Check ownership
        if (!course.getMentorId().equals(mentorId)) {
            throw new ForbiddenException("You can only delete your own courses");
        }

        courseRepository.delete(course);
        log.info("Course deleted successfully: {}", courseId);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getMyCourses(@NonNull UUID mentorId) {
        log.info("Fetching courses for mentor: {}", mentorId);

        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        List<Course> courses = courseRepository.findByMentorId(mentorId);
        
        return courses.stream()
                .map(course -> buildCourseResponse(course, mentor))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseById(@NonNull UUID courseId, @NonNull UUID mentorId) {
        log.info("Fetching course: {} for mentor: {}", courseId, mentorId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Check ownership
        if (!course.getMentorId().equals(mentorId)) {
            throw new ForbiddenException("You can only view your own courses");
        }

        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        return buildCourseResponse(course, mentor);
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseDetailById(@NonNull UUID courseId) {
        log.info("Fetching course details for course: {}", courseId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        @SuppressWarnings("null")
        User mentor = userRepository.findById(course.getMentorId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        return buildCourseDetailResponse(course, mentor);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses() {
        log.info("Fetching all courses");

        List<Course> courses = courseRepository.findAll();

        return courses.stream()
                .map(course -> {
                    @SuppressWarnings("null")
                    User mentor = userRepository.findById(course.getMentorId())
                            .orElse(null);
                    return buildCourseResponse(course, mentor);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getAssignedCourses(@NonNull UUID studentId) {
        log.info("Fetching assigned courses for student: {}", studentId);

        List<Course> courses = courseRepository.findAssignedToStudent(studentId);

        return courses.stream()
                .map(course -> {
                    @SuppressWarnings("null")
                    User mentor = userRepository.findById(course.getMentorId())
                            .orElse(null);
                    return buildCourseResponse(course, mentor);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isCourseOwner(@NonNull UUID courseId, @NonNull UUID mentorId) {
        return courseRepository.existsByIdAndMentorId(courseId, mentorId);
    }

    /* Build CourseResponse DTO */
    private CourseResponse buildCourseResponse(@NonNull Course course, User mentor) {
        // Get chapter count for this course
        long chapterCount = chapterRepository.countByCourseId(course.getId());
        
        // Get student enrollment count for this course
        long studentsEnrolled = courseAssignmentRepository.countByCourseId(course.getId());
        
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .mentorId(course.getMentorId())
                .mentorName(mentor != null ? mentor.getName() : "Unknown")
                .chapterCount(chapterCount)
                .studentsEnrolled(studentsEnrolled)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }

    /* Build CourseDetailResponse DTO with chapters */
    private CourseDetailResponse buildCourseDetailResponse(@NonNull Course course, @NonNull User mentor) {
        List<ChapterResponse> chapterResponses;
        if (course.getChapters() != null && !course.getChapters().isEmpty()) {
            chapterResponses = course.getChapters().stream()
                    .map(chapter -> ChapterResponse.builder()
                            .id(chapter.getId())
                            .courseId(chapter.getCourseId())
                            .title(chapter.getTitle())
                            .description(chapter.getDescription())
                            .imageUrl(chapter.getImageUrl())
                            .videoUrl(chapter.getVideoUrl())
                            .videoDuration(chapter.getVideoDuration())
                            .sequenceOrder(chapter.getSequenceOrder())
                            .isCompleted(false)
                            .isLocked(false)
                            .createdAt(chapter.getCreatedAt())
                            .build())
                    .collect(Collectors.toList());
        } else {
            chapterResponses = new java.util.ArrayList<>();
        }

        return CourseDetailResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .mentorId(course.getMentorId())
                .mentorName(mentor.getName())
                .chapters(chapterResponses)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
