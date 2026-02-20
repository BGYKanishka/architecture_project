package com.bookfair.system.controller.admin;

import com.bookfair.system.dto.UserProfileResponse;
import com.bookfair.system.dto.request.AdminCreateUserRequest;
import com.bookfair.system.dto.request.AdminUpdateUserRequest;
import com.bookfair.system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    /** GET /api/admin/users?role=VENDOR (role param optional) */
    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> getAllUsers(
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(userService.getAllUsers(role));
    }

    /** GET /api/admin/users/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /** POST /api/admin/users */
    @PostMapping
    public ResponseEntity<UserProfileResponse> createUser(
            @RequestBody AdminCreateUserRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    /** PUT /api/admin/users/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<UserProfileResponse> updateUser(
            @PathVariable Long id,
            @RequestBody AdminUpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    /** DELETE /api/admin/users/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    /** PATCH /api/admin/users/{id}/toggle-enabled */
    @PatchMapping("/{id}/toggle-enabled")
    public ResponseEntity<UserProfileResponse> toggleEnabled(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleEnabled(id));
    }

    /** Legacy endpoint — kept for backward compatibility */
    @GetMapping("/employees")
    public ResponseEntity<List<UserProfileResponse>> getEmployees() {
        return ResponseEntity.ok(userService.getAllUsers("EMPLOYEE"));
    }
}
