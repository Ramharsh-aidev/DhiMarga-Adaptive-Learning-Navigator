package com.ttd.lms.model;
import lombok.Data;
import java.util.List;

@Data
public class PathCreateRequest {
    private String graphSlug;
    private String targetRole;
    private Integer deadlineWeeks;
    private Integer hoursPerWeek;
    private List<String> knownSkills;
    private String learningPreference;
    private String contentMode;
    private String topologyMode;
    private List<String> nodeOrder;
}
