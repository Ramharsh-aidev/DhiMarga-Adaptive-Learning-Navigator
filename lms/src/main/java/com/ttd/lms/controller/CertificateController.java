package com.ttd.lms.controller;

import com.ttd.lms.entity.User;
import com.ttd.lms.model.CertificateResponse;
import com.ttd.lms.service.CertificateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping("/courses/{courseId}/generate")
    public ResponseEntity<CertificateResponse> generateCertificate(
            @PathVariable UUID courseId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID studentId = user.getId();
        log.info("Generating certificate for course: {} by student: {}", courseId, studentId);
        
        CertificateResponse response = certificateService.generateCertificate(courseId, studentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<CertificateResponse> getCertificateForCourse(
            @PathVariable UUID courseId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID studentId = user.getId();
        log.info("Fetching certificate for course: {} by student: {}", courseId, studentId);
        
        CertificateResponse response = certificateService.getCertificateByStudentAndCourse(studentId, courseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<CertificateResponse>> getMyCertificates(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID studentId = user.getId();
        log.info("Fetching all certificates for student: {}", studentId);
        
        List<CertificateResponse> certificates = certificateService.getMyCertificates(studentId);
        return ResponseEntity.ok(certificates);
    }
}
