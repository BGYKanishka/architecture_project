package com.bookfair.system.config;

import com.bookfair.system.repository.UserRepository;
import com.bookfair.system.security.ActiveAccountFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String allowedOrigins;

    @Value("${CSRF_COOKIE_SECURE:true}")
    private boolean csrfCookieSecure;

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            OAuth2UserService<OidcUserRequest, OidcUser> cognitoOidcUserService,
            CookieCsrfTokenRepository csrfTokenRepository,
            ActiveAccountFilter activeAccountFilter) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.spa().csrfTokenRepository(csrfTokenRepository))
                .exceptionHandling(exception -> exception.defaultAuthenticationEntryPointFor(
                        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                        PathPatternRequestMatcher.pathPattern("/api/**")))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                        .requestMatchers("/api/auth/csrf", "/api/auth/logout").permitAll()
                        .requestMatchers("/api/stalls/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/vendor-publishers/**").hasRole("VENDOR")
                        .requestMatchers("/api/employee/**").hasRole("EMPLOYEE")
                        .anyRequest().authenticated())
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo.oidcUserService(cognitoOidcUserService))
                        .defaultSuccessUrl("/auth/callback", true)
                        .failureUrl("/login?error=oauth"))
                .logout(logout -> logout.disable());

        http.addFilterBefore(activeAccountFilter, AuthorizationFilter.class);

        return http.build();
    }

    @Bean
    public ActiveAccountFilter activeAccountFilter(UserRepository userRepository) {
        return new ActiveAccountFilter(userRepository);
    }

    @Bean
    public FilterRegistrationBean<ActiveAccountFilter> disableServletFilterRegistration(
            ActiveAccountFilter activeAccountFilter) {
        FilterRegistrationBean<ActiveAccountFilter> registration = new FilterRegistrationBean<>(activeAccountFilter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    public CookieCsrfTokenRepository csrfTokenRepository() {
        CookieCsrfTokenRepository repository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        repository.setCookieCustomizer(cookie -> cookie
                .path("/")
                .secure(csrfCookieSecure)
                .sameSite("Strict"));
        return repository;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(origin -> origin.trim())
                .filter(origin -> !origin.isEmpty())
                .collect(Collectors.toList());
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "X-XSRF-TOKEN"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
