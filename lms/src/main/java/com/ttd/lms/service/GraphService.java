package com.ttd.lms.service;

import com.ttd.lms.entity.CapabilityGraph;
import com.ttd.lms.repository.CapabilityGraphRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GraphService {
    private final CapabilityGraphRepository graphRepository;

    @Transactional(readOnly = true)
    public List<CapabilityGraph> getAllActiveGraphs() {
        return graphRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public CapabilityGraph getGraphBySlug(String slug) {
        return graphRepository.findBySlug(slug)
            .orElseThrow(() -> new RuntimeException("Graph not found: " + slug));
    }
}
