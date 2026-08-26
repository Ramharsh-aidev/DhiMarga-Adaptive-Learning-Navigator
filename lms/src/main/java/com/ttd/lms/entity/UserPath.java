package com.ttd.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user_path")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(exclude = {"nodes", "milestones"})
@ToString(exclude = {"nodes", "milestones"})
public class UserPath {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graph_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "nodes"})
    private CapabilityGraph graph;

    @Builder.Default
    private String status = "active";
    
    private String targetRole;
    
    @Builder.Default
    private Integer deadlineWeeks = 12;
    
    @Builder.Default
    private Integer hoursPerWeek = 10;
    
    private Integer totalBudgetHours;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private String[] knownSkills;

    @Builder.Default
    private String learningPreference = "video";
    
    private String contentMode;
    
    @Builder.Default
    private String pathStatus = "planning";
    
    @Builder.Default
    private Integer totalTimeMinutes = 0;
    
    private LocalDateTime lastActiveAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String weeklyPlan;

    @OneToMany(mappedBy = "userPath", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceOrder ASC")
    @Builder.Default
    private List<UserPathNode> nodes = new ArrayList<>();

    @OneToMany(mappedBy = "userPath", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserPathMilestone> milestones = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
