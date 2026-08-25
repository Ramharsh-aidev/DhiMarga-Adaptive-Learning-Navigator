package com.ttd.lms.controller;

import com.ttd.lms.entity.User;
import com.ttd.lms.model.NavigatorStateRequest;
import com.ttd.lms.model.NavigatorStateResponse;
import com.ttd.lms.service.NavigatorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/navigator")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class NavigatorController {

    private final NavigatorService navigatorService;
    private final com.ttd.lms.service.PathService pathService;

    /**
     * GET /api/navigator/state
     * Returns the stored navigator state JSON for the authenticated student.
     */
    @GetMapping("/state")
    public ResponseEntity<NavigatorStateResponse> getState(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID studentId = user.getId();
        log.info("GET navigator state for student: {}", studentId);

        NavigatorStateResponse response = navigatorService.getState(studentId);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/navigator/state
     * Saves (upserts) the navigator state JSON for the authenticated student.
     * Body: { "stateJson": "{ ...full JSON string }" }
     */
    @PutMapping("/state")
    public ResponseEntity<NavigatorStateResponse> saveState(
            @RequestBody NavigatorStateRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UUID studentId = user.getId();
        log.info("PUT navigator state for student: {}", studentId);

        if (request.getStateJson() == null || request.getStateJson().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        NavigatorStateResponse response = navigatorService.saveState(studentId, request.getStateJson());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/navigator/dashboard-summary
     * Returns highly optimized overview of the active path for the dashboard.
     */
    @GetMapping("/dashboard-summary")
    public ResponseEntity<com.ttd.lms.model.DashboardSummaryResponse> getDashboardSummary(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        com.ttd.lms.model.DashboardSummaryResponse response = pathService.getDashboardSummary(user.getId());
        return ResponseEntity.ok(response);
    }
}
