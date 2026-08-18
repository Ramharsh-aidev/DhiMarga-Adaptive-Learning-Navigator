package com.ttd.lms.repository;

import com.ttd.lms.entity.ApprovalStatus;
import com.ttd.lms.entity.Role;
import com.ttd.lms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@SuppressWarnings("unused")
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    /* Find all pending mentor approvals */
    @Query("SELECT u FROM User u WHERE u.role = 'MENTOR' AND u.approvalStatus = 'PENDING'")
    List<User> findPendingMentors();

    long countByRole(Role role);

    /* Find all approved mentors*/
    @Query("SELECT u FROM User u WHERE u.role = 'MENTOR' AND u.approvalStatus = 'APPROVED'")
    List<User> findApprovedMentors();
}
