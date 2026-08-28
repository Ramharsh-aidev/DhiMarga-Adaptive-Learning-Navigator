package com.ttd.lms.repository;

import com.ttd.lms.entity.Squad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface SquadRepository extends JpaRepository<Squad, UUID> {
}
