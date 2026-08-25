package com.ttd.lms.repository;

import com.ttd.lms.entity.UserPath;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserPathRepository extends JpaRepository<UserPath, UUID> {
    List<UserPath> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<UserPath> findByUserIdAndStatus(UUID userId, String status);
    Optional<UserPath> findByIdAndUserId(UUID id, UUID userId);
    long countByUserIdAndStatus(UUID userId, String status);
}
