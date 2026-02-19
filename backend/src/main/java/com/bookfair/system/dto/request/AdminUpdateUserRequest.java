package com.bookfair.system.dto.request;

import lombok.Data;

@Data
public class AdminUpdateUserRequest {
    private String name;
    private String email;
    private String contactNumber;
    private String businessName;
    private String role; // VENDOR, EMPLOYEE, ADMIN
    private String password; // Optional — only re-hashed if non-empty
    private Boolean enabled;
}
