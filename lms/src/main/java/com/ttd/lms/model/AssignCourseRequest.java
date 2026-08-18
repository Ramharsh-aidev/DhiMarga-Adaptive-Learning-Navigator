package com.ttd.lms.model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class AssignCourseRequest {

    @NotNull(message = "Course ID is required")
    private UUID courseId;

    @NotEmpty(message = "At least one student ID is required")
    private List<UUID> studentIds;
}
