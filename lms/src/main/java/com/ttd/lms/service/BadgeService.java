package com.ttd.lms.service;

import com.ttd.lms.entity.Badge;
import com.ttd.lms.entity.User;
import com.ttd.lms.exception.ResourceNotFoundException;
import com.ttd.lms.repository.BadgeRepository;
import com.ttd.lms.repository.UserRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserRepository userRepository;

    @Transactional
    public Badge awardSkillBadge(@NonNull UUID studentId, @NonNull UUID pathId, @NonNull String skillId, @NonNull String skillName) {
        log.info("Awarding badge for skill: {} to student: {}", skillId, studentId);

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (badgeRepository.existsByUserIdAndSkillId(studentId, skillId)) {
            log.info("Student already has badge for skill: {}", skillId);
            return badgeRepository.findByUserIdAndSkillId(studentId, skillId).get();
        }

        Badge badge = Badge.builder()
                .userId(studentId)
                .pathId(pathId)
                .skillId(skillId)
                .badgeName(skillName + " Mastery")
                .badgeDescription("Awarded for successfully verifying mastery in " + skillName)
                // Use a default generic badge image (can be upgraded to generate dynamic images later)
                .imageUrl("https://res.cloudinary.com/dhimarga/image/upload/v1/badges/default_mastery_badge.png")
                .build();

        return badgeRepository.save(badge);
    }

    @Transactional
    public Badge awardMilestoneBadge(@NonNull UUID studentId, @NonNull UUID pathId, @NonNull String milestoneName) {
        if (badgeRepository.existsByUserIdAndBadgeName(studentId, milestoneName)) {
            return null; // Already awarded
        }

        Badge badge = Badge.builder()
                .userId(studentId)
                .pathId(pathId)
                .badgeName(milestoneName)
                .badgeDescription("Awarded for reaching the milestone: " + milestoneName)
                .imageUrl("https://res.cloudinary.com/dhimarga/image/upload/v1/badges/milestone_badge.png")
                .build();

        return badgeRepository.save(badge);
    }

    @Transactional
    public Badge awardStreakBadge(@NonNull UUID studentId, int streakCount) {
        String badgeName = streakCount + "-Day Streak!";
        if (badgeRepository.existsByUserIdAndBadgeName(studentId, badgeName)) {
            return null; // Already awarded
        }

        Badge badge = Badge.builder()
                .userId(studentId)
                .badgeName(badgeName)
                .badgeDescription("Awarded for maintaining a " + streakCount + "-day learning streak.")
                .imageUrl("/images/certificate_stamp.jpg") // Using stamp image for badges
                .build();

        return badgeRepository.save(badge);
    }

    @Transactional
    public Badge awardChallengerBadge(@NonNull UUID studentId, @NonNull UUID pathId) {
        String badgeName = "Challenger Spirit";
        if (badgeRepository.existsByUserIdAndBadgeName(studentId, badgeName)) {
            return null; // Already awarded
        }

        Badge badge = Badge.builder()
                .userId(studentId)
                .pathId(pathId)
                .badgeName(badgeName)
                .badgeDescription("Awarded for successfully adopting an AI-suggested Challenger Path.")
                .imageUrl("/images/certificate_stamp.jpg")
                .build();

        return badgeRepository.save(badge);
    }

    @Transactional(readOnly = true)
    public List<Badge> getMyBadges(@NonNull UUID studentId) {
        return badgeRepository.findByUserId(studentId);
    }
}
