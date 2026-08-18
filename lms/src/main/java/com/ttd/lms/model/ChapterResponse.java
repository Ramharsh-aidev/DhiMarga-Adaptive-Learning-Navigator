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
public class ChapterResponse {

    private UUID id;
    private UUID courseId;
    private String title;
    private String description;
    private String imageUrl;
    private String videoUrl;
    private Integer videoDuration;
    private Integer sequenceOrder;
    private boolean isCompleted;
    private boolean isLocked;
    private LocalDateTime createdAt;
}
