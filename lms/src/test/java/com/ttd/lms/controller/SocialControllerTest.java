package com.ttd.lms.controller;

import com.ttd.lms.entity.User;
import com.ttd.lms.repository.UserRepository;
import com.ttd.lms.repository.ChallengeRepository;
import com.ttd.lms.repository.SquadRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SocialController.class)
@AutoConfigureMockMvc(addFilters = false)
public class SocialControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;
    
    @MockBean
    private ChallengeRepository challengeRepository;
    
    @MockBean
    private SquadRepository squadRepository;

    @MockBean
    private com.ttd.lms.config.JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @MockBean
    private com.ttd.lms.config.JwtUtil jwtUtil;

    private User testUser1;
    private User testUser2;

    @BeforeEach
    void setUp() {
        testUser1 = new User();
        testUser1.setId(UUID.randomUUID());
        testUser1.setName("Alice");
        testUser1.setXp(1500);

        testUser2 = new User();
        testUser2.setId(UUID.randomUUID());
        testUser2.setName("Bob");
        testUser2.setXp(1200);
    }

    @Test
    @WithMockUser
    void getLeaderboard_ShouldReturnTopUsers() throws Exception {
        org.springframework.data.domain.Page<User> page = new org.springframework.data.domain.PageImpl<>(Arrays.asList(testUser1, testUser2));
        when(userRepository.findByRoleOrderByXpDesc(eq(com.ttd.lms.entity.Role.STUDENT), any())).thenReturn(page);

        mockMvc.perform(get("/api/social/leaderboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].displayName").value("Alice"))
                .andExpect(jsonPath("$.data[0].xp").value(1500))
                .andExpect(jsonPath("$.data[1].displayName").value("Bob"))
                .andExpect(jsonPath("$.data[1].xp").value(1200))
                .andExpect(jsonPath("$.totalItems").value(2));
    }

    @Test
    @WithMockUser
    void getRecommendedMentors_ShouldReturnMockedMentors() throws Exception {
        when(userRepository.findApprovedMentors()).thenReturn(Arrays.asList(testUser1));

        mockMvc.perform(get("/api/social/mentors/recommended"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Alice"))
                .andExpect(jsonPath("$[0].expertise").value("Platform Mentor"))
                .andExpect(jsonPath("$[0].matchScore").value(100));
    }

    @Test
    void getChallenges_ShouldReturnUserChallenges() throws Exception {
        com.ttd.lms.entity.Challenge challenge = new com.ttd.lms.entity.Challenge();
        challenge.setId(UUID.randomUUID());
        challenge.setSkillName("React");
        challenge.setStatus("PENDING");

        when(challengeRepository.findByTargetUserIdOrChallengerIdOrderByCreatedAtDesc(testUser1.getId(), testUser1.getId()))
                .thenReturn(Arrays.asList(challenge));

        org.springframework.security.authentication.UsernamePasswordAuthenticationToken principal = 
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(testUser1, null);

        mockMvc.perform(get("/api/social/challenges").principal(principal))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].skillName").value("React"))
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void getSquads_ShouldReturnAllSquads() throws Exception {
        com.ttd.lms.entity.Squad squad = new com.ttd.lms.entity.Squad();
        squad.setId(UUID.randomUUID());
        squad.setName("Frontend Masters");
        squad.setTopic("React");
        squad.setCurrentMembers(3);
        squad.setMaxMembers(5);

        when(squadRepository.findAll()).thenReturn(Arrays.asList(squad));

        mockMvc.perform(get("/api/social/squads"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Frontend Masters"))
                .andExpect(jsonPath("$[0].topic").value("React"))
                .andExpect(jsonPath("$[0].currentMembers").value(3))
                .andExpect(jsonPath("$[0].maxMembers").value(5));
    }
}
