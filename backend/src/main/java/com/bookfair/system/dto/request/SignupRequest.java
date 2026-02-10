package com.bookfair.system.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    private String name;
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 6)
    private String password;
    private String role; // "vendor", "admin", "employee"
    private String contactNumber;
    private String businessName;
}