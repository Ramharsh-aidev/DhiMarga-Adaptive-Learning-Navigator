package com.ttd.lms.repository;

import com.ttd.lms.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, UUID> {

    List<Chapter> findByCourseIdOrderBySequenceOrderAsc(UUID courseId);

    Optional<Chapter> findByCourseIdAndSequenceOrder(UUID courseId, Integer sequenceOrder);

    /* Get the maximum sequence order for a course */
    @Query("SELECT MAX(c.sequenceOrder) FROM Chapter c WHERE c.courseId = :courseId")
    Optional<Integer> findMaxSequenceOrderByCourseId(@Param("courseId") UUID courseId);

    long countByCourseId(UUID courseId);

    boolean existsByIdAndCourseId(UUID chapterId, UUID courseId);

    void deleteByCourseId(UUID courseId);

    /* Find next chapter by course and current sequence */
    @Query("SELECT c FROM Chapter c WHERE c.courseId = :courseId AND c.sequenceOrder > :currentSequence ORDER BY c.sequenceOrder ASC LIMIT 1")
    Optional<Chapter> findNextChapter(@Param("courseId") UUID courseId, @Param("currentSequence") Integer currentSequence);

    /* Find previous chapter by course and current sequence */
    @Query("SELECT c FROM Chapter c WHERE c.courseId = :courseId AND c.sequenceOrder < :currentSequence ORDER BY c.sequenceOrder DESC LIMIT 1")
    Optional<Chapter> findPreviousChapter(@Param("courseId") UUID courseId, @Param("currentSequence") Integer currentSequence);
}
