package com.ttd.lms.service;

import com.ttd.lms.entity.NavigatorState;
import com.ttd.lms.model.NavigatorStateResponse;
import com.ttd.lms.repository.NavigatorStateRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NavigatorService {

    private final NavigatorStateRepository navigatorStateRepository;

    /**
     * Retrieve the navigator state for a given student.
     * Returns an empty-state response if no state exists yet.
     */
    @Transactional(readOnly = true)
    public NavigatorStateResponse getState(@NonNull UUID userId) {
        log.info("Fetching navigator state for user: {}", userId);

        return navigatorStateRepository.findByUserId(userId)
                .map(state -> NavigatorStateResponse.builder()
                        .userId(state.getUserId())
                        .stateJson(state.getStateJson())
                        .updatedAt(state.getUpdatedAt())
                        .build())
                .orElseGet(() -> NavigatorStateResponse.builder()
                        .userId(userId)
                        .stateJson("{\"paths\":[],\"activePathId\":null}")
                        .updatedAt(null)
                        .build());
    }

    /**
     * Upsert (create or update) the navigator state for a given student.
     */
    @Transactional
    public NavigatorStateResponse saveState(@NonNull UUID userId, @NonNull String stateJson) {
        log.info("Saving navigator state for user: {}", userId);

        NavigatorState state = navigatorStateRepository.findByUserId(userId)
                .orElse(NavigatorState.builder()
                        .userId(userId)
                        .build());

        state.setStateJson(stateJson);
        NavigatorState saved = navigatorStateRepository.save(state);

        log.info("Navigator state saved for user: {}", userId);

        return NavigatorStateResponse.builder()
                .userId(saved.getUserId())
                .stateJson(saved.getStateJson())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }
}
