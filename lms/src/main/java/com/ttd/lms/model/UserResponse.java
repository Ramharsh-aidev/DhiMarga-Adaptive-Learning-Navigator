package com.ttd.lms.model;

import com.ttd.lms.entity.ApprovalStatus;
import com.ttd.lms.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private UUID id;
    private String name;
    private String email;
    private Role role;
    private ApprovalStatus approvalStatus;
    private LocalDateTime createdAt;
}
