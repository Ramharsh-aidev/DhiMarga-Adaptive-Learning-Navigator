package com.ttd.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "social_squads")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Squad {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String topic;
    
    @Builder.Default
    private Integer maxMembers = 5;
    
    @Builder.Default
    private Integer currentMembers = 1;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
