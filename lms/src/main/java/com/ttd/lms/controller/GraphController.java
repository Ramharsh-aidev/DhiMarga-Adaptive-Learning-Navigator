package com.ttd.lms.controller;

import com.ttd.lms.entity.CapabilityGraph;
import com.ttd.lms.service.GraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/navigator/graphs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class GraphController {
    
    private final GraphService graphService;

    @GetMapping
    public ResponseEntity<List<CapabilityGraph>> getAvailableGraphs() {
        return ResponseEntity.ok(graphService.getAllActiveGraphs());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CapabilityGraph> getGraph(@PathVariable String slug) {
        return ResponseEntity.ok(graphService.getGraphBySlug(slug));
    }
}
