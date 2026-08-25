package com.ttd.lms.repository;

import com.ttd.lms.entity.CapabilityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CapabilityGraphRepository extends JpaRepository<CapabilityGraph, UUID> {
    Optional<CapabilityGraph> findBySlug(String slug);
    List<CapabilityGraph> findByIsActiveTrue();
}
