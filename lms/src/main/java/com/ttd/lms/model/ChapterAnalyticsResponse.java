package com.ttd.lms.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChapterAnalyticsResponse {
    
    private String chapterId;
    private String chapterTitle;
    private int sequenceOrder;
    private int totalStudents; // Total enrolled students
    private int studentsStarted; // Students who started this chapter
    private int studentsCompleted; // Students who completed this chapter
    private double completionRate; // Percentage of enrolled students who completed
    private Long averageTimeToCompleteSeconds; // Average time to complete chapter
    private int dropOffCount; // Students who started but didn't complete
}
