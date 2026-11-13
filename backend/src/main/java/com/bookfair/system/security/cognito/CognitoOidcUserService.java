package com.bookfair.system.security.cognito;

import com.bookfair.system.entity.User;
import com.bookfair.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CognitoOidcUserService extends OidcUserService {

    private static final Set<String> VALID_ROLES = Set.of("VENDOR", "EMPLOYEE", "ADMIN");
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) {
        OidcUser cognitoUser = super.loadUser(userRequest);
        String subject = cognitoUser.getSubject();
        String email = cognitoUser.getEmail();
        Object emailVerifiedClaim = cognitoUser.getClaim("email_verified");
        boolean emailVerified = Boolean.TRUE.equals(emailVerifiedClaim)
                || "true".equalsIgnoreCase(String.valueOf(emailVerifiedClaim));

        if (subject == null || subject.isBlank() || subject.length() > 64
                || email == null || email.isBlank() || email.trim().length() > 254
                || email.indexOf('@') <= 0 || email.endsWith("@") || !emailVerified) {
            throw authenticationError("A verified Cognito email is required.");
        }

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        String rawDisplayName = cognitoUser.getFullName();
        final String displayName = rawDisplayName != null && rawDisplayName.length() > 100
                ? rawDisplayName.substring(0, 100)
                : rawDisplayName;
        User user = userRepository.findByCognitoSub(subject).orElse(null);
        if (user != null) {
            updateVerifiedEmail(user, normalizedEmail);
        } else {
            user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                    .map(existing -> linkVerifiedIdentity(existing, subject, normalizedEmail, displayName))
                    .orElseGet(() -> createVendor(subject, normalizedEmail, displayName));
        }

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw authenticationError("This account is disabled.");
        }

        String role = user.getRole() == null ? "" : user.getRole().toUpperCase(Locale.ROOT);
        if (!VALID_ROLES.contains(role)) {
            throw authenticationError("This account has no valid application role.");
        }

        Set<GrantedAuthority> authorities = new HashSet<>(cognitoUser.getAuthorities());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
        return new DefaultOidcUser(authorities, cognitoUser.getIdToken(), cognitoUser.getUserInfo(), "sub");
    }

    private User linkVerifiedIdentity(User user, String subject, String verifiedEmail, String displayName) {
        if (user.getCognitoSub() != null && !user.getCognitoSub().equals(subject)) {
            throw authenticationError("This email is already linked to another identity.");
        }
        user.setCognitoSub(subject);
        user.setEmail(verifiedEmail);
        if ((user.getName() == null || user.getName().isBlank())) {
            user.setName(displayName == null || displayName.isBlank()
                    ? verifiedEmail.substring(0, verifiedEmail.indexOf('@'))
                    : displayName);
        }
        return userRepository.save(user);
    }

    private void updateVerifiedEmail(User user, String verifiedEmail) {
        if (!verifiedEmail.equalsIgnoreCase(user.getEmail())) {
            userRepository.findByEmailIgnoreCase(verifiedEmail)
                    .filter(existing -> !existing.getId().equals(user.getId()))
                    .ifPresent(existing -> {
                        throw authenticationError("This email is already linked to another account.");
                    });
            user.setEmail(verifiedEmail);
            userRepository.save(user);
        }
    }

    private User createVendor(String subject, String email, String name) {
        User user = User.builder()
                .cognitoSub(subject)
                .email(email)
                .name(name == null || name.isBlank() ? email.substring(0, email.indexOf('@')) : name)
                .role("VENDOR")
                .enabled(true)
                .build();
        return userRepository.save(user);
    }

    private OAuth2AuthenticationException authenticationError(String message) {
        return new OAuth2AuthenticationException(new OAuth2Error("access_denied"), message);
    }
}
