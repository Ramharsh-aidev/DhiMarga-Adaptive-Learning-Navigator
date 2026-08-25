package com.ttd.lms.controller;

import com.ttd.lms.entity.User;
import com.ttd.lms.entity.UserPath;
import com.ttd.lms.entity.UserPathNode;
import com.ttd.lms.model.NodeCreateRequest;
import com.ttd.lms.model.NodeUpdateRequest;
import com.ttd.lms.model.PathCreateRequest;
import com.ttd.lms.service.PathService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/navigator/paths")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class PathController {

    private final PathService pathService;

    @GetMapping
    public ResponseEntity<List<UserPath>> getUserPaths(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(pathService.getUserPaths(user.getId()));
    }

    @PostMapping
    public ResponseEntity<UserPath> createPath(@RequestBody PathCreateRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(pathService.createPath(user.getId(), request));
    }

    @PutMapping("/{pathId}/nodes/{skillId}")
    public ResponseEntity<Void> updateNodeMastery(
            @PathVariable UUID pathId,
            @PathVariable String skillId,
            @RequestBody NodeUpdateRequest request) {
        pathService.updateNodeMastery(pathId, skillId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{pathId}/nodes")
    public ResponseEntity<UserPathNode> addAiPersonalizationNode(
            @PathVariable UUID pathId,
            @RequestBody NodeCreateRequest request) {
        return ResponseEntity.ok(pathService.addAiInjectedNode(pathId, request));
    }

    @GetMapping("/{pathId}")
    public ResponseEntity<UserPath> getPath(@PathVariable UUID pathId) {
        return ResponseEntity.ok(pathService.getPathById(pathId));
    }

    @PutMapping("/{pathId}/content-mode")
    public ResponseEntity<UserPath> updateContentMode(@PathVariable UUID pathId, @RequestBody java.util.Map<String, String> request) {
        return ResponseEntity.ok(pathService.updateContentMode(pathId, request.get("contentMode")));
    }

    @PutMapping("/{pathId}/status")
    public ResponseEntity<UserPath> updatePathStatus(@PathVariable UUID pathId,
            @RequestBody java.util.Map<String, String> request) {
        return ResponseEntity.ok(pathService.updatePathStatus(pathId, request.get("status")));
    }

    @PostMapping("/{pathId}/milestones")
    public ResponseEntity<com.ttd.lms.entity.UserPathMilestone> addMilestone(@PathVariable UUID pathId,
            @RequestBody java.util.Map<String, String> request) {
        return ResponseEntity.ok(pathService.addMilestone(pathId, request.get("title"), request.get("description")));
    }

    @PutMapping("/{pathId}/milestones/{milestoneId}/toggle")
    public ResponseEntity<com.ttd.lms.entity.UserPathMilestone> toggleMilestone(@PathVariable UUID pathId,
            @PathVariable UUID milestoneId) {
        return ResponseEntity.ok(pathService.toggleMilestone(pathId, milestoneId));
    }

    @DeleteMapping("/{pathId}")
    public ResponseEntity<Void> deletePath(@PathVariable UUID pathId) {
        pathService.deletePath(pathId);
        return ResponseEntity.noContent().build();
    }
}
