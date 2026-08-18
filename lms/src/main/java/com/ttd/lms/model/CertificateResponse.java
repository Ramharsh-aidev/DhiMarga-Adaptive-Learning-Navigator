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
public class CertificateResponse {

    private UUID id;
    private UUID userId;
    private String userName;
    private UUID courseId;
    private String courseTitle;
    private String certificateUrl;
    private LocalDateTime issuedAt;
}
