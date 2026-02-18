package com.bookfair.system.controller.auth;

import com.bookfair.system.dto.request.AdminLoginRequest;
import com.bookfair.system.dto.request.LoginRequest;
import com.bookfair.system.dto.response.JwtResponse;
import com.bookfair.system.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth/admin")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateAdmin(@Valid @RequestBody AdminLoginRequest adminLoginRequest) {
        // Map AdminLoginRequest to LoginRequest
        // usage of username as email is intended as per UserDetailsServiceImpl logic
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(adminLoginRequest.getUsername());
        loginRequest.setPassword(adminLoginRequest.getPassword());

        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);

            List<String> roles = jwtResponse.getRoles();
            if (roles.contains("ROLE_ADMIN") || roles.contains("ROLE_EMPLOYEE")) {
                return ResponseEntity.ok(jwtResponse);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Error: Unauthorized access. Admin privileges required.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Invalid credentials");
        }
    }
}