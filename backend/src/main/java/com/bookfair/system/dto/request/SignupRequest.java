package com.bookfair.system.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be under 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required") 
    @Email(message = "Please provide a valid email address")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
    
    private String role; 
    
    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Contact number must be a valid format (10-15 digits)")
    private String contactNumber;
    
    @Size(max = 100, message = "Business name must be under 100 characters")
    private String businessName;
}
