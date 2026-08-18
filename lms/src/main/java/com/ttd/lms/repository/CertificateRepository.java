package com.ttd.lms.repository;

import com.ttd.lms.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {

    Optional<Certificate> findByUserIdAndCourseId(UUID userId, UUID courseId);

    boolean existsByUserIdAndCourseId(UUID userId, UUID courseId);

    List<Certificate> findByUserId(UUID userId);


    List<Certificate> findByCourseId(UUID courseId);

    long countByCourseId(UUID courseId);

    long countByUserId(UUID userId);

    /* Get total certificates issued (for admin analytics) */
    @Query("SELECT COUNT(c) FROM Certificate c")
    long countTotalCertificates();

    void deleteByUserIdAndCourseId(UUID userId, UUID courseId);
}
