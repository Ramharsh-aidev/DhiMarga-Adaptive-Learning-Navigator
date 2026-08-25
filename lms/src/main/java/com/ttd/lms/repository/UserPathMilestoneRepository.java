package com.ttd.lms.repository;

import com.ttd.lms.entity.UserPathMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface UserPathMilestoneRepository extends JpaRepository<UserPathMilestone, UUID> {
    List<UserPathMilestone> findByUserPathIdOrderByCreatedAtAsc(UUID userPathId);
}
