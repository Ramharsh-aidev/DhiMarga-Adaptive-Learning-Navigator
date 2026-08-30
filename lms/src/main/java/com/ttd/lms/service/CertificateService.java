package com.ttd.lms.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.element.Image;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.layout.properties.TextAlignment;
import com.ttd.lms.entity.Certificate;
import com.ttd.lms.entity.Course;
import com.ttd.lms.entity.Role;
import com.ttd.lms.entity.User;
import com.ttd.lms.exception.BadRequestException;
import com.ttd.lms.exception.ForbiddenException;
import com.ttd.lms.exception.InternalServerException;
import com.ttd.lms.exception.ResourceNotFoundException;
import com.ttd.lms.model.CertificateResponse;
import com.ttd.lms.repository.CertificateRepository;
import com.ttd.lms.repository.CourseRepository;
import com.ttd.lms.repository.ProgressRepository;
import com.ttd.lms.repository.UserRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;
    private final Cloudinary cloudinary;

    /**
     * Generate certificate for a student upon course completion
     * Validates 100% completion before generating
     */
    @Transactional
    public CertificateResponse generateCertificate(@NonNull UUID courseId, @NonNull UUID studentId) {
        log.info("Generating certificate for student: {} and course: {}", studentId, courseId);

        // Validate student exists and has STUDENT role
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("Only students can receive certificates");
        }

        // Validate course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Get mentor information
        @SuppressWarnings("null")
        User mentor = userRepository.findById(course.getMentorId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        // Check if certificate already exists
        if (certificateRepository.existsByUserIdAndCourseId(studentId, courseId)) {
            log.warn("Certificate already exists for student: {} and course: {}", studentId, courseId);
            Certificate existingCertificate = certificateRepository.findByUserIdAndCourseId(studentId, courseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
            return buildCertificateResponse(existingCertificate, course, student);
        }

        // VALIDATE 100% COMPLETION
        boolean isCourseCompleted = progressRepository.isCourseCompleted(studentId, courseId);
        if (!isCourseCompleted) {
            throw new BadRequestException("You must complete all chapters before receiving a certificate");
        }

        try {
            // Generate PDF certificate
            byte[] pdfBytes = generateCertificatePDF(student.getName(), course.getTitle(), mentor.getName());

            // Upload PDF to Cloudinary
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    pdfBytes,
                    ObjectUtils.asMap(
                            "resource_type", "raw",
                            "folder", "lms/certificates",
                            "public_id", String.format("certificate_%s_%s", studentId, courseId),
                            "format", "pdf"
                    )
            );

            String certificateUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            log.info("Certificate PDF uploaded to Cloudinary: {}", publicId);

            // Save certificate record to database
            Certificate certificate = Certificate.builder()
                    .userId(studentId)
                    .courseId(courseId)
                    .certificateUrl(certificateUrl)
                    .cloudinaryPublicId(publicId)
                    .build();

            @SuppressWarnings("null")
            Certificate savedCertificate = certificateRepository.save(certificate);
            log.info("Certificate generated successfully for student: {} and course: {}", studentId, courseId);

            return buildCertificateResponse(savedCertificate, course, student);

        } catch (IOException e) {
            log.error("Failed to generate or upload certificate", e);
            throw new InternalServerException("Failed to generate certificate: " + e.getMessage());
        }
    }

    /**
     * Get certificate by ID
     */
    @Transactional(readOnly = true)
    public CertificateResponse getCertificateById(@NonNull UUID certificateId) {
        log.info("Fetching certificate: {}", certificateId);

        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));

        @SuppressWarnings("null")
        Course course = courseRepository.findById(certificate.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        @SuppressWarnings("null")
        User student = userRepository.findById(certificate.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return buildCertificateResponse(certificate, course, student);
    }

    /**
     * Get certificate by student and course
     */
    @Transactional(readOnly = true)
    public CertificateResponse getCertificateByStudentAndCourse(@NonNull UUID studentId, @NonNull UUID courseId) {
        log.info("Fetching certificate for student: {} and course: {}", studentId, courseId);

        Certificate certificate = certificateRepository.findByUserIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found for this student and course"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return buildCertificateResponse(certificate, course, student);
    }

    /**
     * Get all certificates for a student
     */
    @Transactional(readOnly = true)
    public List<CertificateResponse> getMyCertificates(@NonNull UUID studentId) {
        log.info("Fetching all certificates for student: {}", studentId);

        // Validate student exists
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("Only students have certificates");
        }

        List<Certificate> certificates = certificateRepository.findByUserId(studentId);

        return certificates.stream()
                .map(certificate -> {
                    @SuppressWarnings("null")
                    Course course = courseRepository.findById(certificate.getCourseId())
                            .orElse(null);
                    return buildCertificateResponse(certificate, course, student);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get all certificates for a course (Admin/Mentor only)
     */
    @Transactional(readOnly = true)
    public List<CertificateResponse> getCertificatesByCourse(@NonNull UUID courseId, @NonNull UUID requesterId, @NonNull Role requesterRole) {
        log.info("Fetching certificates for course: {} by user: {}", courseId, requesterId);

        // Validate course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Authorization check
        if (requesterRole == Role.MENTOR && !course.getMentorId().equals(requesterId)) {
            throw new ForbiddenException("You can only view certificates for your own courses");
        } else if (requesterRole != Role.ADMIN && requesterRole != Role.MENTOR) {
            throw new ForbiddenException("Only admins and mentors can view course certificates");
        }

        List<Certificate> certificates = certificateRepository.findByCourseId(courseId);

        return certificates.stream()
                .map(certificate -> {
                    @SuppressWarnings("null")
                    User student = userRepository.findById(certificate.getUserId())
                            .orElse(null);
                    return buildCertificateResponse(certificate, course, student);
                })
                .collect(Collectors.toList());
    }

    /**
     * Delete certificate (Admin only or for regeneration purposes)
     */
    @Transactional
    public void deleteCertificate(@NonNull UUID certificateId, @NonNull UUID adminId, @NonNull Role adminRole) {
        log.info("Deleting certificate: {} by admin: {}", certificateId, adminId);

        if (adminRole != Role.ADMIN) {
            throw new ForbiddenException("Only admins can delete certificates");
        }

        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));

        // Delete from Cloudinary
        if (certificate.getCloudinaryPublicId() != null && !certificate.getCloudinaryPublicId().isEmpty()) {
            try {
                cloudinary.uploader().destroy(
                        certificate.getCloudinaryPublicId(),
                        ObjectUtils.asMap("resource_type", "raw")
                );
                log.info("Certificate deleted from Cloudinary: {}", certificate.getCloudinaryPublicId());
            } catch (IOException e) {
                log.error("Failed to delete certificate from Cloudinary", e);
                // Continue with database deletion even if Cloudinary deletion fails
            }
        }

        certificateRepository.delete(certificate);
        log.info("Certificate deleted successfully: {}", certificateId);
    }

    /**
     * Check if student is eligible for certificate (100% completion)
     */
    @Transactional(readOnly = true)
    public boolean isEligibleForCertificate(@NonNull UUID courseId, @NonNull UUID studentId) {
        log.info("Checking certificate eligibility for student: {} and course: {}", studentId, courseId);

        // Check if already has certificate
        if (certificateRepository.existsByUserIdAndCourseId(studentId, courseId)) {
            return false; // Already has certificate
        }

        // Check if course is 100% complete
        return progressRepository.isCourseCompleted(studentId, courseId);
    }

    /**
     * Generate PDF certificate using iText
     */
    private byte[] generateCertificatePDF(String studentName, String courseTitle, String mentorName) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            pdfDoc.setDefaultPageSize(PageSize.A4.rotate()); // Landscape orientation

            Document document = new Document(pdfDoc);
            document.setMargins(50, 50, 50, 50);

            // Add certificate title
            Paragraph title = new Paragraph()
                    .add(new Text("CERTIFICATE OF COMPLETION").setBold().setFontSize(36).setFontColor(ColorConstants.BLUE))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(40);
            document.add(title);

            // Add decorative line
            document.add(new Paragraph("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(20)
                    .setFontColor(ColorConstants.BLUE));

            // Add "This is to certify that"
            document.add(new Paragraph("This is to certify that")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(18)
                    .setMarginTop(20));

            // Add student name
            document.add(new Paragraph(studentName)
                    .setBold()
                    .setFontSize(28)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.DARK_GRAY)
                    .setMarginTop(10));

            // Add completion text
            document.add(new Paragraph("has successfully completed the course")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(18)
                    .setMarginTop(15));

            // Add course title
            document.add(new Paragraph(courseTitle)
                    .setBold()
                    .setFontSize(24)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.BLUE)
                    .setMarginTop(10));

            // Add date and mentor signature
            String formattedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
            
            document.add(new Paragraph()
                    .add(new Text("Date: ").setBold())
                    .add(formattedDate)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(14)
                    .setMarginTop(30));

            document.add(new Paragraph()
                    .add(new Text("Instructor: ").setBold())
                    .add(mentorName)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(14)
                    .setMarginTop(5));

            // Add Ramharsh's Signature
            document.add(new Paragraph("Signature: Ramharsh")
                    .setItalic()
                    .setFontSize(18)
                    .setFontColor(ColorConstants.DARK_GRAY)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginTop(10));

            // Add Stamp Image
            try {
                org.springframework.core.io.Resource resource = new org.springframework.core.io.ClassPathResource("static/images/certificate_stamp.jpg");
                ImageData data = ImageDataFactory.create(resource.getURL());
                Image stamp = new Image(data);
                stamp.scaleToFit(100, 100);
                stamp.setFixedPosition(pdfDoc.getDefaultPageSize().getWidth() - 150, 50); // Bottom right corner
                document.add(stamp);
            } catch (Exception imgEx) {
                log.warn("Could not load certificate stamp image", imgEx);
            }

            // Add footer
            document.add(new Paragraph("Learning Management System")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(12)
                    .setFontColor(ColorConstants.GRAY)
                    .setMarginTop(15));

            document.close();

        } catch (Exception e) {
            throw new IOException("Failed to generate PDF certificate", e);
        }

        return baos.toByteArray();
    }

    /**
     * Build CertificateResponse DTO
     */
    private CertificateResponse buildCertificateResponse(Certificate certificate, Course course, User student) {
        return CertificateResponse.builder()
                .id(certificate.getId())
                .userId(certificate.getUserId())
                .userName(student != null ? student.getName() : "Unknown")
                .courseId(certificate.getCourseId())
                .courseTitle(course != null ? course.getTitle() : "Unknown")
                .certificateUrl(certificate.getCertificateUrl())
                .issuedAt(certificate.getIssuedAt())
                .build();
    }
}
