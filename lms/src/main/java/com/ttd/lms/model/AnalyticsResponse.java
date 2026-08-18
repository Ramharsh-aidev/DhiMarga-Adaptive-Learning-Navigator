package com.ttd.lms.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    private Long totalUsers;
    private Long totalStudents;
    private Long totalMentors;
    private Long totalAdmins;
    private Long pendingMentorApprovals;
    private Long totalCourses;
    private Long totalChapters;
    private Long totalCertificatesIssued;
    private Long totalCourseAssignments;
}
