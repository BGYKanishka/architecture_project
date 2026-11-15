package com.bookfair.system.controller.auth;

import com.bookfair.system.dto.UserProfileResponse;
import com.bookfair.system.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();

    @Value("${app.cognito.domain:}")
    private String cognitoDomain;

    @Value("${app.cognito.client-id}")
    private String cognitoClientId;

    @Value("${app.public-url}")
    private String appPublicUrl;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> currentUser(@AuthenticationPrincipal OidcUser principal) {
        return ResponseEntity.ok(userService.getUserProfileByCognitoSub(principal.getSubject()));
    }

    @GetMapping("/csrf")
    public ResponseEntity<Map<String, String>> csrfToken(CsrfToken csrfToken) {
        return ResponseEntity.ok(Map.of("token", csrfToken.getToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            Authentication authentication,
            HttpServletRequest request,
            HttpServletResponse response) {
        logoutHandler.logout(request, response, authentication);

        if (cognitoDomain.isBlank()) {
            String loginUrl = appPublicUrl.replaceAll("/+$", "") + "/login";
            return ResponseEntity.ok(Map.of("logoutUrl", loginUrl));
        }

        String domain = cognitoDomain.replaceAll("/+$", "");
        String cleanLogoutUri = appPublicUrl.replaceAll("/+$", "");
        String encodedLogoutUri = java.net.URLEncoder.encode(cleanLogoutUri, java.nio.charset.StandardCharsets.UTF_8);
        String logoutUrl = domain + "/logout?client_id=" + cognitoClientId + "&logout_uri=" + encodedLogoutUri;
        return ResponseEntity.ok(Map.of("logoutUrl", logoutUrl));
    }
}
