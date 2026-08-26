package com.ttd.lms.model;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data @Builder
public class DashboardSummaryResponse {
    private long activePaths;
    private UUID activePathId;
    private String activePathName;
    private int completedSkills;
    private int totalSkills;
    private int progressPercentage;
    private NextSkillDto nextSkill;
    private List<WeakSkillDto> weakSkills;
    private int totalTimeMinutes;
    private String pathStatus;
    
    // User Progression
    private int xp;
    private int level;

    @Data @Builder
    public static class NextSkillDto {
        private String skillId;
        private String label;
        private String category;
        private Double estimatedHours;
    }

    @Data @Builder
    public static class WeakSkillDto {
        private String skillId;
        private String label;
    }
}
