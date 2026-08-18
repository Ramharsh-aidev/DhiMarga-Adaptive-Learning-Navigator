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
public class ChapterProgressResponse {
    private UUID chapterId;
    private String chapterTitle;
    private Integer sequenceOrder;
    private Boolean isCompleted;
    private Boolean isStarted;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
