package com.ttd.lms.model;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class NodeUpdateRequest {
    private Integer masteryScore;
    private String evidenceLevel;
    private String status;
    private BigDecimal estimatedHours;
    private Integer sequenceOrder;
    private Boolean isRecovery;
}
