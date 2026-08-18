package com.ttd.lms.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateChapterRequest {

    @NotBlank(message = "Chapter title is required")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @NotBlank(message = "Chapter description is required")
    @Size(min = 10, max = 5000, message = "Description must be between 10 and 5000 characters")
    private String description;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    @NotBlank(message = "Video URL is required")
    @Size(max = 500, message = "Video URL must not exceed 500 characters")
    private String videoUrl;

    private String cloudinaryPublicId;

    private Integer videoDuration;

    @NotNull(message = "Sequence order is required")
    private Integer sequenceOrder;
}
