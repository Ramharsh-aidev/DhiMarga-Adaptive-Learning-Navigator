package com.ttd.lms.model;
import lombok.Data;

@Data
public class PathUpdateRequest {
    private Integer deadlineWeeks;
    private Integer hoursPerWeek;
    private Integer totalTimeMinutes;
    private String weeklyPlan;
}
