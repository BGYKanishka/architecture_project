package com.bookfair.system.dto.request;

import lombok.Data;

@Data
public class AdminCreateUserRequest {
    private String name;
    private String email;
    private String password;
    private String role; // VENDOR, EMPLOYEE, ADMIN
    private String contactNumber;
    private String businessName;
}
