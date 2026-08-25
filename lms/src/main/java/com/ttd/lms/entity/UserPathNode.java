package com.ttd.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_path_node", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_path_id", "skill_id"})
})
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserPathNode {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_path_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private UserPath userPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graph_node_id") // Nullable for AI injected nodes
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "prerequisites", "graph"})
    private GraphNode graphNode;

    @Column(name = "skill_id", nullable = false)
    private String skillId;

    @Column(length = 500)
    private String label;

    @Builder.Default
    private String status = "upcoming";
    
    @Builder.Default
    private Integer masteryScore = 0;
    
    @Builder.Default
    private String evidenceLevel = "none";
    
    @Builder.Default
    private Integer sequenceOrder = 0;
    
    @Builder.Default
    private BigDecimal estimatedHours = BigDecimal.valueOf(2.0);
    
    @Builder.Default
    private Boolean isUserAdded = false;
    
    @Builder.Default
    private Boolean isRecovery = false;
    
    @Builder.Default
    private Boolean isAiInjected = false;
    
    @Column(columnDefinition = "TEXT")
    private String personalizationNote;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String selectedResource;

    private LocalDateTime completedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
