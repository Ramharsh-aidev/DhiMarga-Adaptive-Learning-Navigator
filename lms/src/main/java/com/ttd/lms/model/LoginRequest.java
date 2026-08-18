package com.ttd.lms.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NonNull
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NonNull
    @NotBlank(message = "Password is required")
    private String password;
}
