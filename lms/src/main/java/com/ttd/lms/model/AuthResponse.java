package com.ttd.lms.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token; // Nullable for pending mentor registrations
    @NonNull
    @Builder.Default
    private String type = "Bearer";
    @NonNull
    private UserResponse user;

    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
        this.type = "Bearer";
    }
}
