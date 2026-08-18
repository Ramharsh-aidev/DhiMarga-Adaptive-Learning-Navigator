package com.ttd.lms.repository;

import com.ttd.lms.entity.CourseAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseAssignmentRepository extends JpaRepository<CourseAssignment, UUID> {

    List<CourseAssignment> findByStudentId(UUID studentId);

    List<CourseAssignment> findByCourseId(UUID courseId);

    boolean existsByCourseIdAndStudentId(UUID courseId, UUID studentId);

    /* Find assignment by course and student */
    @Query("SELECT ca FROM CourseAssignment ca WHERE ca.courseId = :courseId AND ca.studentId = :studentId")
    CourseAssignment findByCourseIdAndStudentId(@Param("courseId") UUID courseId, @Param("studentId") UUID studentId);

    /* Get all students assigned to a course */
    @Query("SELECT ca.student FROM CourseAssignment ca WHERE ca.courseId = :courseId")
    List<com.ttd.lms.entity.User> findStudentsByCourseId(@Param("courseId") UUID courseId);

    /* Count students enrolled in a course */
    long countByCourseId(UUID courseId);

    /* Count courses assigned to a student */
    long countByStudentId(UUID studentId);

    void deleteByCourseIdAndStudentId(UUID courseId, UUID studentId);

    void deleteByCourseId(UUID courseId);
}
