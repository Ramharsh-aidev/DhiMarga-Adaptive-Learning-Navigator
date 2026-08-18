package com.ttd.lms.service;

import com.ttd.lms.entity.ApprovalStatus;
import com.ttd.lms.entity.Course;
import com.ttd.lms.entity.CourseAssignment;
import com.ttd.lms.entity.Role;
import com.ttd.lms.entity.User;
import com.ttd.lms.exception.BadRequestException;
import com.ttd.lms.exception.ForbiddenException;
import com.ttd.lms.exception.ResourceNotFoundException;
import com.ttd.lms.model.AnalyticsResponse;
import com.ttd.lms.model.StudentEnrollmentResponse;
import com.ttd.lms.model.UserManagementResponse;
import com.ttd.lms.model.UserResponse;
import com.ttd.lms.repository.*;

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
public class UserService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CertificateRepository certificateRepository;
    private final CourseAssignmentRepository courseAssignmentRepository;
    private final ChapterRepository chapterRepository;

    @Transactional(readOnly = true)
    public List<UserManagementResponse> getAllUsers() {
        log.info("Fetching all users");
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::buildUserManagementResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(@NonNull Role role) {
        log.info("Fetching users by role: {}", role);
        List<User> users = userRepository.findByRole(role);
        return users.stream()
                .map(this::buildUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentEnrollmentResponse> getStudentsWithEnrollmentStatus(@NonNull UUID courseId, @NonNull UUID mentorId) {
        log.info("Fetching students with enrollment status for course: {} by mentor: {}", courseId, mentorId);
        
        // Verify mentor owns the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        if (!course.getMentorId().equals(mentorId)) {
            throw new ForbiddenException("You can only view students for your own courses");
        }
        
        // Get all students
        List<User> allStudents = userRepository.findByRole(Role.STUDENT);
        
        // Get enrolled students for this course
        List<CourseAssignment> enrollments = courseAssignmentRepository.findByCourseId(courseId);
        
        // Create a map for quick lookup
        java.util.Map<UUID, CourseAssignment> enrollmentMap = enrollments.stream()
                .collect(Collectors.toMap(CourseAssignment::getStudentId, assignment -> assignment));
        
        // Build response with enrollment status
        return allStudents.stream()
                .map(student -> {
                    CourseAssignment enrollment = enrollmentMap.get(student.getId());
                    return StudentEnrollmentResponse.builder()
                            .studentId(student.getId())
                            .name(student.getName())
                            .email(student.getEmail())
                            .isEnrolled(enrollment != null)
                            .enrolledAt(enrollment != null ? enrollment.getAssignedAt() : null)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getPendingMentors() {
        log.info("Fetching pending mentor approvals");
        List<User> pendingMentors = userRepository.findPendingMentors();
        return pendingMentors.stream()
                .map(this::buildUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse approveMentor(@NonNull UUID userId, boolean approved) {
        log.info("Updating mentor approval status for user: {} to {}", userId, approved);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.MENTOR) {
            throw new BadRequestException("User is not a mentor");
        }

        user.setApprovalStatus(approved ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED);
        User updatedUser = userRepository.save(user);

        log.info("Mentor {} approval status updated to: {}", user.getEmail(), approved);
        return buildUserResponse(updatedUser);
    }

    @Transactional
    public void deleteUser(@NonNull UUID userId) {
        log.info("Deleting user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot delete admin users");
        }

        userRepository.delete(user);
        log.info("User deleted successfully: {}", userId);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(@NonNull UUID userId) {
        log.info("Fetching user by ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return buildUserResponse(user);
    }

    /* Get platform analytics (Admin only) */
    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics() {
        log.info("Generating platform analytics");

        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalMentors = userRepository.countByRole(Role.MENTOR);
        long totalAdmins = userRepository.countByRole(Role.ADMIN);
        long pendingMentorApprovals = userRepository.findPendingMentors().size();
        long totalCourses = courseRepository.count();
        long totalChapters = chapterRepository.count();
        long totalCertificatesIssued = certificateRepository.count();
        long totalCourseAssignments = courseAssignmentRepository.count();

        return AnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalStudents(totalStudents)
                .totalMentors(totalMentors)
                .totalAdmins(totalAdmins)
                .pendingMentorApprovals(pendingMentorApprovals)
                .totalCourses(totalCourses)
                .totalChapters(totalChapters)
                .totalCertificatesIssued(totalCertificatesIssued)
                .totalCourseAssignments(totalCourseAssignments)
                .build();
    }

    /* Get all students for mentor to assign courses */
    @Transactional(readOnly = true)
    public List<UserResponse> getAllStudents() {
        log.info("Fetching all students");
        List<User> students = userRepository.findByRole(Role.STUDENT);
        return students.stream()
                .map(this::buildUserResponse)
                .collect(Collectors.toList());
    }

    /* Build UserResponse from User entity */
    private UserResponse buildUserResponse(@NonNull User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .approvalStatus(user.getApprovalStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }

    /* Build UserManagementResponse with additional stats */
    private UserManagementResponse buildUserManagementResponse(@NonNull User user) {
        Integer coursesCreated = null;
        Integer coursesEnrolled = null;
        Integer certificatesEarned = null;

        if (user.getRole() == Role.MENTOR) {
            coursesCreated = (int) courseRepository.countByMentorId(user.getId());
        } else if (user.getRole() == Role.STUDENT) {
            coursesEnrolled = (int) courseAssignmentRepository.countByStudentId(user.getId());
            certificatesEarned = (int) certificateRepository.countByUserId(user.getId());
        }

        return UserManagementResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .approvalStatus(user.getApprovalStatus())
                .coursesCreated(coursesCreated)
                .coursesEnrolled(coursesEnrolled)
                .certificatesEarned(certificatesEarned)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
