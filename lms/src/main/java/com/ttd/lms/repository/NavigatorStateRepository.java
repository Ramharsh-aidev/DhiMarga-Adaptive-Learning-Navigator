package com.ttd.lms.repository;

import com.ttd.lms.entity.NavigatorState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NavigatorStateRepository extends JpaRepository<NavigatorState, UUID> {
    Optional<NavigatorState> findByUserId(UUID userId);
}
