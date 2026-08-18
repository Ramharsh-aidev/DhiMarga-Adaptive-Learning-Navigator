package com.ttd.lms.model;

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
public class StudentEnrollmentResponse {
    
    private UUID studentId;
    private String name;
    private String email;
    private boolean isEnrolled; // Whether student is enrolled in the specific course
    private LocalDateTime enrolledAt; // When they were enrolled (null if not enrolled)
}
