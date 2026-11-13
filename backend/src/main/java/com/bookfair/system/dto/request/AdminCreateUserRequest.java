package com.bookfair.system.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminCreateUserRequest {
    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Email
    @Size(max = 254)
    private String email;

    @NotBlank
    @Pattern(regexp = "(?i)^(VENDOR|EMPLOYEE|ADMIN)$")
    private String role; // VENDOR, EMPLOYEE, ADMIN

    @Pattern(regexp = "^$|^\\+?[0-9]{10,15}$")
    private String contactNumber;

    @Size(max = 100)
    private String businessName;
}
