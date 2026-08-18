package com.ttd.lms.repository;

import com.ttd.lms.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, UUID> {

    Optional<Progress> findByUserIdAndChapterId(UUID userId, UUID chapterId);

    List<Progress> findByUserIdAndCourseIdOrderByChapter_SequenceOrderAsc(UUID userId, UUID courseId);

    /* Find all completed chapters for a user in a course */
    @Query("SELECT p FROM Progress p WHERE p.userId = :userId AND p.courseId = :courseId AND p.isCompleted = true")
    List<Progress> findCompletedChaptersByUserAndCourse(@Param("userId") UUID userId, @Param("courseId") UUID courseId);

    /* Calculate completion percentage for a user in a course */
    @Query("SELECT COUNT(p) * 100.0 / (SELECT COUNT(c) FROM Chapter c WHERE c.courseId = :courseId) " +
           "FROM Progress p WHERE p.userId = :userId AND p.courseId = :courseId AND p.isCompleted = true")
    Double calculateCompletionPercentage(@Param("userId") UUID userId, @Param("courseId") UUID courseId);

    /* Check if a user has completed a specific chapter */
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Progress p " +
           "WHERE p.userId = :userId AND p.chapterId = :chapterId AND p.isCompleted = true")
    boolean isChapterCompletedByUser(@Param("userId") UUID userId, @Param("chapterId") UUID chapterId);

    /* Check if user has completed all previous chapters */
    @Query("SELECT CASE WHEN COUNT(c) = COUNT(p) THEN true ELSE false END " +
           "FROM Chapter c LEFT JOIN Progress p ON c.id = p.chapterId AND p.userId = :userId AND p.isCompleted = true " +
           "WHERE c.courseId = :courseId AND c.sequenceOrder < :sequenceOrder")
    boolean hasCompletedPreviousChapters(@Param("userId") UUID userId, @Param("courseId") UUID courseId, @Param("sequenceOrder") Integer sequenceOrder);

    /* Get count of completed chapters by user in a course */
    long countByUserIdAndCourseIdAndIsCompletedTrue(UUID userId, UUID courseId);

    /* Check if course is 100% complete for user */
    @Query("SELECT CASE WHEN COUNT(p) = (SELECT COUNT(c) FROM Chapter c WHERE c.courseId = :courseId) THEN true ELSE false END " +
           "FROM Progress p WHERE p.userId = :userId AND p.courseId = :courseId AND p.isCompleted = true")
    boolean isCourseCompleted(@Param("userId") UUID userId, @Param("courseId") UUID courseId);

    List<Progress> findByCourseId(UUID courseId);

    void deleteByCourseId(UUID courseId);
}