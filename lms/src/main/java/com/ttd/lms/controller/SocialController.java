package com.ttd.lms.controller;

import com.ttd.lms.entity.User;
import com.ttd.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.ttd.lms.repository.ChallengeRepository;
import com.ttd.lms.repository.SquadRepository;
import com.ttd.lms.entity.Challenge;
import com.ttd.lms.entity.Squad;
import java.util.UUID;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class SocialController {
    
    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;
    private final SquadRepository squadRepository;

    @GetMapping("/leaderboard")
    public ResponseEntity<Map<String, Object>> getLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<User> topUsers = userRepository.findByRoleOrderByXpDesc(com.ttd.lms.entity.Role.STUDENT, pageable);
        
        List<Map<String, Object>> leaderboard = topUsers.stream().map(u -> Map.<String, Object>of(
            "id", u.getId().toString(),
            "displayName", u.getName(),
            "xp", u.getXp() == null ? 0 : u.getXp(),
            "level", u.getLevel() == null ? 1 : u.getLevel(),
            "streak", u.getCurrentStreak() == null ? 0 : u.getCurrentStreak()
        )).collect(Collectors.toList());
        
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("data", leaderboard);
        response.put("currentPage", topUsers.getNumber());
        response.put("totalItems", topUsers.getTotalElements());
        response.put("totalPages", topUsers.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/mentors/recommended")
    public ResponseEntity<List<Map<String, Object>>> getRecommendedMentors() {
        List<User> mentors = userRepository.findApprovedMentors();
        List<Map<String, Object>> recommended = mentors.stream().limit(3).map(u -> Map.<String, Object>of(
            "id", u.getId().toString(),
            "name", u.getName(),
            "expertise", "Platform Mentor",
            "matchScore", 100
        )).collect(Collectors.toList());
        return ResponseEntity.ok(recommended);
    }

    @GetMapping("/challenges")
    public ResponseEntity<List<Challenge>> getChallenges(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Challenge> challenges = challengeRepository.findByTargetUserIdOrChallengerIdOrderByCreatedAtDesc(user.getId(), user.getId());
        return ResponseEntity.ok(challenges);
    }

    @GetMapping("/squads")
    public ResponseEntity<List<Squad>> getSquads() {
        return ResponseEntity.ok(squadRepository.findAll());
    }
}
