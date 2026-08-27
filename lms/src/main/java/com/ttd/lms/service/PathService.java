package com.ttd.lms.service;

import com.ttd.lms.entity.*;
import com.ttd.lms.model.*;
import com.ttd.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PathService {
    private final UserPathRepository userPathRepository;
    private final UserPathNodeRepository userPathNodeRepository;
    private final CapabilityGraphRepository graphRepository;
    private final GraphNodeRepository graphNodeRepository;
    private final UserPathMilestoneRepository userPathMilestoneRepository;
    private final UserRepository userRepository;
    private final BadgeService badgeService;

    @Transactional(readOnly = true)
    public List<UserPath> getUserPaths(UUID userId) {
        return userPathRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public UserPath createPath(UUID userId, PathCreateRequest request) {
        CapabilityGraph graph = graphRepository.findBySlug(request.getGraphSlug())
            .orElseThrow(() -> new RuntimeException("Graph not found"));
            
        UserPath path = UserPath.builder()
            .userId(userId)
            .graph(graph)
            .targetRole(request.getTargetRole())
            .deadlineWeeks(request.getDeadlineWeeks())
            .hoursPerWeek(request.getHoursPerWeek())
            .knownSkills(request.getKnownSkills() != null ? request.getKnownSkills().toArray(new String[0]) : new String[0])
            .learningPreference(request.getLearningPreference())
            .contentMode(request.getContentMode())
            .build();
            
        path = userPathRepository.save(path);
        
        // Setup initial nodes based on graph template
        List<GraphNode> templateNodes = graphNodeRepository.findByGraphIdOrderBySequenceOrderAsc(graph.getId());
        for (int i = 0; i < templateNodes.size(); i++) {
            GraphNode templateNode = templateNodes.get(i);
            UserPathNode node = UserPathNode.builder()
                .userPath(path)
                .graphNode(templateNode)
                .skillId(templateNode.getSkillId())
                .label(templateNode.getLabel())
                .sequenceOrder(i + 1)
                // Determine initial status based on knownSkills
                .status(request.getKnownSkills() != null && request.getKnownSkills().contains(templateNode.getSkillId()) ? "completed" : "upcoming")
                .masteryScore(request.getKnownSkills() != null && request.getKnownSkills().contains(templateNode.getSkillId()) ? 100 : 0)
                .build();
            userPathNodeRepository.save(node);
        }
        
        return path;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary(UUID userId) {
        List<UserPath> activePaths = userPathRepository.findByUserIdAndStatus(userId, "active");
        if (activePaths.isEmpty()) {
            return DashboardSummaryResponse.builder().activePaths(0).build();
        }
        
        UserPath activePath = activePaths.get(0);
        List<UserPathNode> nodes = userPathNodeRepository.findByUserPathIdOrderBySequenceOrderAsc(activePath.getId());
        
        int total = nodes.size();
        int completed = (int) nodes.stream().filter(n -> "completed".equals(n.getStatus())).count();
        int progress = total > 0 ? (completed * 100) / total : 0;
        
        UserPathNode next = nodes.stream().filter(n -> !"completed".equals(n.getStatus()) && !"skipped".equals(n.getStatus())).findFirst().orElse(null);
        DashboardSummaryResponse.NextSkillDto nextDto = null;
        if (next != null) {
            nextDto = DashboardSummaryResponse.NextSkillDto.builder()
                .skillId(next.getSkillId())
                .label(next.getLabel())
                .estimatedHours(next.getEstimatedHours().doubleValue())
                .build();
        }
        
        List<DashboardSummaryResponse.WeakSkillDto> weak = nodes.stream()
            .filter(n -> "gap".equals(n.getStatus()))
            .map(n -> DashboardSummaryResponse.WeakSkillDto.builder().skillId(n.getSkillId()).label(n.getLabel()).build())
            .collect(Collectors.toList());

        User user = userRepository.findById(userId).orElseThrow();

        return DashboardSummaryResponse.builder()
            .activePaths(activePaths.size())
            .activePathId(activePath.getId())
            .activePathName(activePath.getTargetRole())
            .completedSkills(completed)
            .totalSkills(total)
            .progressPercentage(progress)
            .nextSkill(nextDto)
            .weakSkills(weak)
            .totalTimeMinutes(activePath.getTotalTimeMinutes())
            .pathStatus(activePath.getPathStatus())
            .xp(user.getXp() != null ? user.getXp() : 0)
            .level(user.getLevel() != null ? user.getLevel() : 1)
            .build();
    }
    
    @Transactional
    public UserPath updatePath(UUID pathId, com.ttd.lms.model.PathUpdateRequest req) {
        UserPath path = userPathRepository.findById(pathId)
            .orElseThrow(() -> new RuntimeException("Path not found"));
            
        if (req.getDeadlineWeeks() != null) path.setDeadlineWeeks(req.getDeadlineWeeks());
        if (req.getHoursPerWeek() != null) path.setHoursPerWeek(req.getHoursPerWeek());
        if (req.getTotalTimeMinutes() != null) path.setTotalTimeMinutes(req.getTotalTimeMinutes());
        if (req.getWeeklyPlan() != null) path.setWeeklyPlan(req.getWeeklyPlan());
        
        return userPathRepository.save(path);
    }

    @Transactional
    public void updateNodeMastery(UUID pathId, String skillId, NodeUpdateRequest req) {
        UserPathNode node = userPathNodeRepository.findByUserPathIdAndSkillId(pathId, skillId)
            .orElseThrow(() -> new RuntimeException("Node not found"));
            
        boolean wasNotCompleted = !"completed".equals(node.getStatus());
        
        if(req.getMasteryScore() != null) node.setMasteryScore(req.getMasteryScore());
        if(req.getEvidenceLevel() != null) node.setEvidenceLevel(req.getEvidenceLevel());
        if(req.getStatus() != null) node.setStatus(req.getStatus());
        if(req.getEstimatedHours() != null) node.setEstimatedHours(req.getEstimatedHours());
        if(req.getSequenceOrder() != null) node.setSequenceOrder(req.getSequenceOrder());
        
        // Handle XP and Level updates
        if (wasNotCompleted && "completed".equals(node.getStatus())) {
            UserPath path = userPathRepository.findById(pathId).orElseThrow();
            User user = userRepository.findById(path.getUserId()).orElseThrow();
            
            int hours = node.getEstimatedHours() != null ? node.getEstimatedHours().intValue() : 3;
            // Base XP: 10 per hour.
            int earnedXp = hours * 10;
            
            // Bonus for recovering a gap
            if (Boolean.TRUE.equals(req.getIsRecovery()) || (req.getEvidenceLevel() != null && req.getEvidenceLevel().equals("strong_recovery"))) {
                earnedXp += 50; // Recovery bonus
            }
            
            user.setXp(user.getXp() + earnedXp);
            
            // Calculate Level: Level = (XP / 100) + 1
            int newLevel = (user.getXp() / 100) + 1;
            user.setLevel(newLevel);
            
            // Streak Calculation
            java.time.LocalDate today = java.time.LocalDate.now();
            if (user.getLastActiveDate() == null) {
                user.setCurrentStreak(1);
            } else if (user.getLastActiveDate().equals(today.minusDays(1))) {
                user.setCurrentStreak(user.getCurrentStreak() + 1);
            } else if (!user.getLastActiveDate().equals(today)) {
                user.setCurrentStreak(1);
            }
            user.setLastActiveDate(today);

            userRepository.save(user);

            // Award Streak Badges
            try {
                int streak = user.getCurrentStreak();
                if (streak == 7 || streak == 14 || streak == 30) {
                    badgeService.awardStreakBadge(user.getId(), streak);
                }
            } catch (Exception e) {
                // Ignore badge failure
            }
        }
        
        userPathNodeRepository.save(node);
    }
    
    @Transactional
    public UserPathNode addAiInjectedNode(UUID pathId, NodeCreateRequest req) {
        UserPath path = userPathRepository.findById(pathId).orElseThrow();
        UserPathNode newNode = UserPathNode.builder()
            .userPath(path)
            .skillId(req.getSkillId())
            .label(req.getLabel())
            .isAiInjected(true)
            .personalizationNote(req.getPersonalizationNote())
            .sequenceOrder(req.getSequenceOrder())
            .status("upcoming")
            .selectedResource(req.getSelectedResource())
            .build();
        return userPathNodeRepository.save(newNode);
    }

    @Transactional(readOnly = true)
    public UserPath getPathById(UUID pathId) {
        return userPathRepository.findById(pathId)
            .orElseThrow(() -> new RuntimeException("Path not found"));
    }

    @Transactional
    public UserPath updateContentMode(UUID pathId, String contentMode) {
        UserPath path = userPathRepository.findById(pathId)
            .orElseThrow(() -> new RuntimeException("Path not found"));
        path.setContentMode(contentMode);
        return userPathRepository.save(path);
    }

    @Transactional
    public UserPath updatePathStatus(UUID pathId, String status) {
        UserPath path = userPathRepository.findById(pathId)
            .orElseThrow(() -> new RuntimeException("Path not found"));
        
        // If making this active, set all other paths for user to inactive
        if ("active".equals(status)) {
            List<UserPath> allPaths = userPathRepository.findByUserIdOrderByCreatedAtDesc(path.getUserId());
            for (UserPath p : allPaths) {
                if (!p.getId().equals(pathId) && "active".equals(p.getStatus())) {
                    p.setStatus("inactive");
                    userPathRepository.save(p);
                }
            }
        }
        
        path.setStatus(status);
        return userPathRepository.save(path);
    }

    @Transactional
    public UserPathMilestone addMilestone(UUID pathId, String title, String description) {
        UserPath path = userPathRepository.findById(pathId)
            .orElseThrow(() -> new RuntimeException("Path not found"));
        UserPathMilestone milestone = UserPathMilestone.builder()
            .userPath(path)
            .title(title)
            .description(description)
            .build();
        return userPathMilestoneRepository.save(milestone);
    }

    @Transactional
    public UserPathMilestone toggleMilestone(UUID pathId, UUID milestoneId) {
        UserPathMilestone milestone = userPathMilestoneRepository.findById(milestoneId)
            .orElseThrow(() -> new RuntimeException("Milestone not found"));
        if (!milestone.getUserPath().getId().equals(pathId)) {
            throw new RuntimeException("Milestone does not belong to path");
        }
        milestone.setIsCompleted(!milestone.getIsCompleted());
        if (milestone.getIsCompleted()) {
            milestone.setCompletedAt(java.time.LocalDateTime.now());
            // Award Milestone Badge
            try {
                badgeService.awardMilestoneBadge(milestone.getUserPath().getUserId(), pathId, milestone.getTitle());
            } catch (Exception e) {
                // Ignore
            }
        } else {
            milestone.setCompletedAt(null);
        }
        return userPathMilestoneRepository.save(milestone);
    }

    @Transactional
    public void deletePath(UUID pathId) {
        if (!userPathRepository.existsById(pathId)) {
            throw new RuntimeException("Path not found");
        }
        // user_path_node and user_path_milestone should be deleted by cascade or manually
        // We will just call deleteById. CascadeType.ALL on OneToMany handles it if set up.
        // Let's check UserPath entity if it has cascade.
        userPathRepository.deleteById(pathId);
    }
}
