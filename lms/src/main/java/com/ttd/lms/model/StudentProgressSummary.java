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
public class StudentProgressSummary {
    
    private UUID studentId;
    private String studentName;
    private String studentEmail;
    private int totalChapters;
    private int completedChapters;
    private int inProgressChapters;
    private int notStartedChapters;
    private double progressPercentage;
    private Long totalTimeSpentSeconds;
    private LocalDateTime lastAccessedAt;
    private LocalDateTime enrolledAt;
    private LocalDateTime firstChapterStartedAt;
    private LocalDateTime lastChapterCompletedAt;
    private Double learningVelocity; // Chapters per day
}
