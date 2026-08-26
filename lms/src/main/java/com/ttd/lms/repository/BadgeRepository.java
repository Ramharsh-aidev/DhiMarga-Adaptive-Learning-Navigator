package com.ttd.lms.repository;

import com.ttd.lms.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, UUID> {
    
    List<Badge> findByUserId(UUID userId);
    
    List<Badge> findByUserIdAndPathId(UUID userId, UUID pathId);
    
    Optional<Badge> findByUserIdAndSkillId(UUID userId, String skillId);
    
    boolean existsByUserIdAndSkillId(UUID userId, String skillId);
    
    boolean existsByUserIdAndBadgeName(UUID userId, String badgeName);
}
