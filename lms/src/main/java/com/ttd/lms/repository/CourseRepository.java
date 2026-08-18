package com.ttd.lms.repository;

import com.ttd.lms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    List<Course> findByMentorId(UUID mentorId);

    /* Find all courses assigned to a specific student */
    @Query("SELECT DISTINCT ca.course FROM CourseAssignment ca " +
           "LEFT JOIN FETCH ca.course.chapters " +
           "LEFT JOIN FETCH ca.course.mentor " +
           "WHERE ca.studentId = :studentId")
    List<Course> findAssignedToStudent(@Param("studentId") UUID studentId);

    boolean existsByIdAndMentorId(UUID courseId, UUID mentorId);

    long countByMentorId(UUID mentorId);

    /* Find courses by mentor with chapters loaded */
    @Query("SELECT DISTINCT c FROM Course c LEFT JOIN FETCH c.chapters WHERE c.mentorId = :mentorId")
    List<Course> findByMentorIdWithChapters(@Param("mentorId") UUID mentorId);
}
