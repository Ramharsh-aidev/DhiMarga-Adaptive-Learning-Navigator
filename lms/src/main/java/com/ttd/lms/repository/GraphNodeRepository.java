package com.ttd.lms.repository;

import com.ttd.lms.entity.GraphNode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface GraphNodeRepository extends JpaRepository<GraphNode, UUID> {
    List<GraphNode> findByGraphIdOrderBySequenceOrderAsc(UUID graphId);
}
