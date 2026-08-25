package com.ttd.lms.model;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class NodeCreateRequest {
    private String skillId;
    private String label;
    private String category;
    private Boolean isAiInjected;
    private String personalizationNote;
    private Integer sequenceOrder;
    private BigDecimal estimatedHours;
    private String selectedResource;
}
