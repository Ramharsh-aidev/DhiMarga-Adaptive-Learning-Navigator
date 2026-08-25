package com.ttd.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_path_milestone")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserPathMilestone {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_path_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private UserPath userPath;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private Boolean isCompleted = false;
    
    private LocalDateTime completedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
