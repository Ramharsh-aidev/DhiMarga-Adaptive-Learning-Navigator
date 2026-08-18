package com.ttd.lms.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseAnalyticsResponse {
    
    private UUID courseId;
    private String courseTitle;
    private Integer totalStudents;
    private Integer studentsNotStarted;
    private Integer studentsInProgress;
    private Integer studentsCompleted;
    private Double completionRate; // Percentage
    private Double averageProgress; // Percentage
    private List<ChapterAnalyticsResponse> chapterAnalytics;
    private Long averageTimeToCompleteSeconds; // Average time in seconds
    private LocalDateTime lastUpdated;
}
