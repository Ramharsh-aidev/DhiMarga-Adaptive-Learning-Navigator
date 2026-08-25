package com.ttd.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "graph_node", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"graph_id", "skill_id"})
})
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(exclude = {"graph", "prerequisites"})
@ToString(exclude = {"graph", "prerequisites"})
public class GraphNode {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graph_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private CapabilityGraph graph;

    @Column(name = "skill_id", nullable = false)
    private String skillId;

    @Column(nullable = false, length = 500)
    private String label;

    private String category;
    
    @Builder.Default
    private Integer masteryThreshold = 70;
    
    @Builder.Default
    private BigDecimal goalRelevance = BigDecimal.valueOf(0.5);
    
    @Builder.Default
    private BigDecimal dependencyImpact = BigDecimal.valueOf(0.5);
    
    @Builder.Default
    private Integer sequenceOrder = 0;
    
    @Builder.Default
    private Boolean isCustom = false;

    @ManyToMany
    @JoinTable(
        name = "graph_node_prerequisite",
        joinColumns = @JoinColumn(name = "node_id"),
        inverseJoinColumns = @JoinColumn(name = "prerequisite_id")
    )
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "prerequisites"})
    @Builder.Default
    private Set<GraphNode> prerequisites = new HashSet<>();

    @CreationTimestamp
    private LocalDateTime createdAt;
}
