package com.bookfair.system.controller;

import com.bookfair.system.dto.UserProfileResponse;
import com.bookfair.system.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/profile")
  public ResponseEntity<UserProfileResponse> getUserProfile(Principal principal) {
    String email = principal.getName();
    UserProfileResponse userProfile = userService.getUserProfile(email);
    return ResponseEntity.ok(userProfile);
  }

  @PutMapping("/profile")
  public ResponseEntity<UserProfileResponse> updateProfile(Principal principal,
      @RequestBody com.bookfair.system.dto.request.UserProfileUpdateRequest request) {
    String email = principal.getName();
    UserProfileResponse userProfile = userService.updateProfile(email, request);
    return ResponseEntity.ok(userProfile);
  }

  @PostMapping("/change-password")
  public ResponseEntity<?> changePassword(Principal principal,
      @Valid @RequestBody com.bookfair.system.dto.request.ChangePasswordRequest request) {
    String email = principal.getName();
    userService.changePassword(email, request);
    return ResponseEntity.ok("Password changed successfully");
  }
}
