package com.ttd.lms.controller;

import com.ttd.lms.entity.Badge;
import com.ttd.lms.entity.User;
import com.ttd.lms.service.BadgeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/badges")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class BadgeController {

    private final BadgeService badgeService;

    @GetMapping("/my")
    public ResponseEntity<List<Badge>> getMyBadges(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(badgeService.getMyBadges(user.getId()));
    }

    @PostMapping("/challenger/{pathId}")
    public ResponseEntity<Badge> awardChallengerBadge(@PathVariable java.util.UUID pathId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Badge badge = badgeService.awardChallengerBadge(user.getId(), pathId);
        return ResponseEntity.ok(badge);
    }
}
