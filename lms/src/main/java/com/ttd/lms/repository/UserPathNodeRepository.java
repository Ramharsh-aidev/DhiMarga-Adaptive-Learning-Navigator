package com.ttd.lms.repository;

import com.ttd.lms.entity.UserPathNode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserPathNodeRepository extends JpaRepository<UserPathNode, UUID> {
    List<UserPathNode> findByUserPathIdOrderBySequenceOrderAsc(UUID userPathId);
    Optional<UserPathNode> findByUserPathIdAndSkillId(UUID userPathId, String skillId);
    List<UserPathNode> findByUserPathIdAndStatus(UUID userPathId, String status);
    long countByUserPathIdAndStatus(UUID userPathId, String status);
}
