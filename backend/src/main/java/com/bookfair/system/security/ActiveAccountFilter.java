package com.bookfair.system.security;

import com.bookfair.system.entity.User;
import com.bookfair.system.repository.UserRepository;
import com.bookfair.system.security.cognito.CognitoOidcUserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@RequiredArgsConstructor
public class ActiveAccountFilter extends OncePerRequestFilter {

    private static final Set<String> VALID_ROLES = Set.of("VENDOR", "EMPLOYEE", "ADMIN");
    private final UserRepository userRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return "/api/auth/csrf".equals(path)
                || "/api/auth/logout".equals(path);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof OidcUser principal)) {
            filterChain.doFilter(request, response);
            return;
        }

        User account = userRepository.findByCognitoSub(principal.getSubject()).orElse(null);
        if (account == null && principal.getEmail() != null) {
            String email = principal.getEmail().trim().toLowerCase(Locale.ROOT);
            account = userRepository.findByEmailIgnoreCase(email).orElse(null);
            if (account != null && !principal.getSubject().equals(account.getCognitoSub())) {
                account.setCognitoSub(principal.getSubject());
                account = userRepository.save(account);
            }
        }

        // Sync role if Cognito token specifies cognito:groups or custom:role
        String cognitoRole = CognitoOidcUserService.extractRoleFromCognito(principal);
        if (account != null && cognitoRole != null && !cognitoRole.equalsIgnoreCase(account.getRole())) {
            account.setRole(cognitoRole);
            account = userRepository.save(account);
        }

        String role = account == null || account.getRole() == null
                ? ""
                : account.getRole().toUpperCase(Locale.ROOT);
        if (account == null || !Boolean.TRUE.equals(account.getEnabled()) || !VALID_ROLES.contains(role)) {
            SecurityContextHolder.clearContext();
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            response.sendError(HttpStatus.UNAUTHORIZED.value());
            return;
        }

        List<GrantedAuthority> currentAuthorities = new ArrayList<>();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            String value = authority.getAuthority();
            if (!"ROLE_VENDOR".equals(value) && !"ROLE_EMPLOYEE".equals(value) && !"ROLE_ADMIN".equals(value)) {
                currentAuthorities.add(authority);
            }
        }
        currentAuthorities.add(new SimpleGrantedAuthority("ROLE_" + role));
        UsernamePasswordAuthenticationToken refreshed = new UsernamePasswordAuthenticationToken(
                principal, null, currentAuthorities);
        refreshed.setDetails(authentication.getDetails());
        SecurityContextHolder.getContext().setAuthentication(refreshed);

        filterChain.doFilter(request, response);
    }
}
