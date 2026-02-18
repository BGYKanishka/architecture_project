package com.bookfair.system.controller.admin;

import com.bookfair.system.dto.UserProfileResponse;
import com.bookfair.system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    @GetMapping("/employees")
    public ResponseEntity<List<UserProfileResponse>> getEmployees() {
        return ResponseEntity.ok(userService.getEmployees());
    }
}
