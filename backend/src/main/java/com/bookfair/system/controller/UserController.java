package com.bookfair.system.controller;

import com.bookfair.system.dto.UserProfileResponse;
import com.bookfair.system.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/profile")
  public ResponseEntity<UserProfileResponse> getUserProfile(@AuthenticationPrincipal OidcUser principal) {
    UserProfileResponse userProfile = userService.getUserProfileByCognitoSub(principal.getSubject());
    return ResponseEntity.ok(userProfile);
  }

  @PutMapping("/profile")
  public ResponseEntity<UserProfileResponse> updateProfile(@AuthenticationPrincipal OidcUser principal,
      @Valid @RequestBody com.bookfair.system.dto.request.UserProfileUpdateRequest request) {
    UserProfileResponse userProfile = userService.updateProfileByCognitoSub(principal.getSubject(), request);
    return ResponseEntity.ok(userProfile);
  }
}
