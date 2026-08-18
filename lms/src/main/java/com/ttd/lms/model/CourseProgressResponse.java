package com.ttd.lms.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseProgressResponse {

    private UUID courseId;
    private String courseTitle;
    private UUID studentId;
    private String studentName;
    private Integer totalChapters;
    private Integer completedChapters;
    private Double completionPercentage;
    private boolean isCertificateAvailable;
    private List<ChapterProgressResponse> chapters;
}
