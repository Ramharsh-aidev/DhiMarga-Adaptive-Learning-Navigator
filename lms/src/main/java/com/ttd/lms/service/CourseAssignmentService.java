package com.ttd.lms.service;

import com.ttd.lms.entity.Course;
import com.ttd.lms.entity.CourseAssignment;
import com.ttd.lms.entity.Role;
import com.ttd.lms.entity.User;
import com.ttd.lms.exception.BadRequestException;
import com.ttd.lms.exception.DuplicateResourceException;
import com.ttd.lms.exception.ForbiddenException;
import com.ttd.lms.exception.ResourceNotFoundException;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseAssignmentService {

    private final CourseAssignmentRepository courseAssignmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    /* Assign a course to a student (Admin or Mentor only) and Mentors can only assign their own courses */
    @SuppressWarnings("null")
    @Transactional
    public void assignCourse(@NonNull UUID courseId, @NonNull UUID studentId, @NonNull UUID assignerId, @NonNull Role assignerRole) {
        log.info("Assigning course: {} to student: {} by: {}", courseId, studentId, assignerId);

        // Validate course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Validate student exists and has STUDENT role
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("Can only assign courses to students");
        }

        // Authorization check
        if (assignerRole == Role.MENTOR) {
            // Mentors can only assign their own courses
            if (!course.getMentorId().equals(assignerId)) {
                throw new ForbiddenException("You can only assign your own courses");
            }
        } else if (assignerRole != Role.ADMIN) {
            throw new ForbiddenException("Only admins and mentors can assign courses");
        }

        // Check if already assigned
        if (courseAssignmentRepository.existsByCourseIdAndStudentId(courseId, studentId)) {
            throw new DuplicateResourceException("Course already assigned to this student");
        }

        // Create assignment
        CourseAssignment assignment = CourseAssignment.builder()
                .courseId(courseId)
                .studentId(studentId)
                .build();

        courseAssignmentRepository.save(assignment);
        log.info("Course {} successfully assigned to student {}", courseId, studentId);
    }

    /* Unassign a course from a student (Admin or Mentor only) */
    @SuppressWarnings("null")
    @Transactional
    public void unassignCourse(@NonNull UUID courseId, @NonNull UUID studentId, @NonNull UUID unassignerId, @NonNull Role unassignerRole) {
        log.info("Unassigning course: {} from student: {} by: {}", courseId, studentId, unassignerId);

        // Validate course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Authorization check
        if (unassignerRole == Role.MENTOR) {
            // Mentors can only unassign their own courses
            if (!course.getMentorId().equals(unassignerId)) {
                throw new ForbiddenException("You can only unassign your own courses");
            }
        } else if (unassignerRole != Role.ADMIN) {
            throw new ForbiddenException("Only admins and mentors can unassign courses");
        }

        // Find and delete assignment
        List<CourseAssignment> assignments = courseAssignmentRepository.findByStudentId(studentId);
        CourseAssignment assignment = assignments.stream()
                .filter(a -> a.getCourseId().equals(courseId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Course assignment not found"));

        courseAssignmentRepository.delete(assignment);
        log.info("Course {} successfully unassigned from student {}", courseId, studentId);
    }

    /* Get all students assigned to a specific course (Mentor/Admin only) */
    @SuppressWarnings("null")
    @Transactional(readOnly = true)
    public List<User> getAssignedStudents(@NonNull UUID courseId, @NonNull UUID requesterId, @NonNull Role requesterRole) {
        log.info("Fetching assigned students for course: {} by: {}", courseId, requesterId);

        // Validate course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Authorization check
        if (requesterRole == Role.MENTOR && !course.getMentorId().equals(requesterId)) {
            throw new ForbiddenException("You can only view students assigned to your own courses");
        } else if (requesterRole != Role.ADMIN && requesterRole != Role.MENTOR) {
            throw new ForbiddenException("Only admins and mentors can view assigned students");
        }

        List<CourseAssignment> assignments = courseAssignmentRepository.findByCourseId(courseId);
        List<UUID> studentIds = assignments.stream()
                .map(CourseAssignment::getStudentId)
                .toList();

        return userRepository.findAllById(studentIds);
    }

    /* Get all courses assigned to a specific student */
    @SuppressWarnings("null")
    @Transactional(readOnly = true)
    public List<Course> getAssignedCourses(@NonNull UUID studentId) {
        log.info("Fetching assigned courses for student: {}", studentId);

        // Validate student exists
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("User is not a student");
        }

        List<CourseAssignment> assignments = courseAssignmentRepository.findByStudentId(studentId);
        List<UUID> courseIds = assignments.stream()
                .map(CourseAssignment::getCourseId)
                .toList();

        return courseRepository.findAllById(courseIds);
    }
    
    /* Check if a course is assigned to a specific student */
    @Transactional(readOnly = true)
    public boolean isCourseAssigned(@NonNull UUID courseId, @NonNull UUID studentId) {
        return courseAssignmentRepository.existsByCourseIdAndStudentId(courseId, studentId);
    }

    /* Assign multiple students to a course (Bulk assignment) */
    @SuppressWarnings("null")
    @Transactional
    public void assignCourseBulk(@NonNull UUID courseId, @NonNull List<UUID> studentIds, 
                                 @NonNull UUID assignerId, @NonNull Role assignerRole) {
        log.info("Bulk assigning course: {} to {} students", courseId, studentIds.size());

        // Validate course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Authorization check
        if (assignerRole == Role.MENTOR && !course.getMentorId().equals(assignerId)) {
            throw new ForbiddenException("You can only assign your own courses");
        } else if (assignerRole != Role.ADMIN && assignerRole != Role.MENTOR) {
            throw new ForbiddenException("Only admins and mentors can assign courses");
        }

        int successCount = 0;
        int skipCount = 0;

        for (UUID studentId : studentIds) {
            try {
                // Validate student
                User student = userRepository.findById(studentId)
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
                
                if (student.getRole() != Role.STUDENT) {
                    log.warn("Skipping non-student user: {}", studentId);
                    skipCount++;
                    continue;
                }

                // Skip if already assigned
                if (courseAssignmentRepository.existsByCourseIdAndStudentId(courseId, studentId)) {
                    log.info("Course already assigned to student: {}", studentId);
                    skipCount++;
                    continue;
                }

                // Create assignment
                CourseAssignment assignment = CourseAssignment.builder()
                        .courseId(courseId)
                        .studentId(studentId)
                        .build();

                courseAssignmentRepository.save(assignment);
                successCount++;

            } catch (Exception e) {
                log.error("Failed to assign course to student: {}", studentId, e);
                skipCount++;
            }
        }

        log.info("Bulk assignment completed: {} successful, {} skipped", successCount, skipCount);
    }
}
