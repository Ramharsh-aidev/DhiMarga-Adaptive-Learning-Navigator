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
public class CourseResponse {

    private UUID id;
    private String title;
    private String description;
    private UUID mentorId;
    private String mentorName;
    private Integer totalChapters;
    private Integer completedChapters;
    private Double completionPercentage;
    private Long studentsEnrolled;
    private Long chapterCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
