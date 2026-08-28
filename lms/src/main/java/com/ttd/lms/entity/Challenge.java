package com.ttd.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "social_challenges")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Challenge {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private UUID challengerId;
    
    @Column(nullable = false)
    private UUID targetUserId;
    
    @Column(nullable = false)
    private String skillId;
    
    @Column(nullable = false)
    private String skillName;
    
    @Builder.Default
    private String status = "PENDING"; // PENDING, ACCEPTED, COMPLETED
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
