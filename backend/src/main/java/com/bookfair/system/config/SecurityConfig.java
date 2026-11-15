package com.bookfair.system.config;

import com.bookfair.system.repository.UserRepository;
import com.bookfair.system.security.ActiveAccountFilter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
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

        @Value("${app.public-url:http://localhost:3000}")
        private String appPublicUrl;

        @Value("${CSRF_COOKIE_SECURE:true}")
        private boolean csrfCookieSecure;

        @Bean
        public SecurityFilterChain filterChain(
                        HttpSecurity http,
                        OAuth2UserService<OidcUserRequest, OidcUser> cognitoOidcUserService,
                        CookieCsrfTokenRepository csrfTokenRepository,
                        ActiveAccountFilter activeAccountFilter,
                        ClientRegistrationRepository clientRegistrationRepository) throws Exception {
                String successUrl = (appPublicUrl != null && !appPublicUrl.isBlank())
                                ? appPublicUrl.replaceAll("/+$", "") + "/auth/callback"
                                : "/auth/callback";
                String failureUrl = (appPublicUrl != null && !appPublicUrl.isBlank())
                                ? appPublicUrl.replaceAll("/+$", "") + "/login?error=oauth"
                                : "/login?error=oauth";

                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.spa().csrfTokenRepository(csrfTokenRepository))
                                .exceptionHandling(exception -> exception.defaultAuthenticationEntryPointFor(
                                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                                                PathPatternRequestMatcher.pathPattern("/api/**")))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/oauth2/**", "/login/oauth2/**", "/auth/callback")
                                                .permitAll()
                                                .requestMatchers("/api/auth/csrf", "/api/auth/logout").permitAll()
                                                .requestMatchers("/api/stalls", "/api/stalls/**").permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .requestMatchers("/api/vendor-publishers/**").hasAnyRole("VENDOR", "EMPLOYEE", "ADMIN")
                                                .requestMatchers("/api/employee/**").hasAnyRole("EMPLOYEE", "ADMIN")
                                                .anyRequest().authenticated())
                                .oauth2Login(oauth -> oauth
                                                .authorizationEndpoint(authorization -> authorization
                                                                .authorizationRequestResolver(
                                                                                authorizationRequestResolver(
                                                                                                clientRegistrationRepository)))
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .oidcUserService(cognitoOidcUserService))
                                                .defaultSuccessUrl(successUrl, true)
                                                .failureUrl(failureUrl))
                                .logout(logout -> logout.disable());

                http.addFilterBefore(activeAccountFilter, AuthorizationFilter.class);

                return http.build();
        }

        private OAuth2AuthorizationRequestResolver authorizationRequestResolver(
                        ClientRegistrationRepository clientRegistrationRepository) {
                DefaultOAuth2AuthorizationRequestResolver defaultResolver = new DefaultOAuth2AuthorizationRequestResolver(
                                clientRegistrationRepository, "/oauth2/authorization");

                return new OAuth2AuthorizationRequestResolver() {
                        @Override
                        public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
                                OAuth2AuthorizationRequest req = defaultResolver.resolve(request);
                                return customize(req, request);
                        }

                        @Override
                        public OAuth2AuthorizationRequest resolve(HttpServletRequest request,
                                        String clientRegistrationId) {
                                OAuth2AuthorizationRequest req = defaultResolver.resolve(request, clientRegistrationId);
                                return customize(req, request);
                        }

                        private OAuth2AuthorizationRequest customize(OAuth2AuthorizationRequest req,
                                        HttpServletRequest request) {
                                if (req == null)
                                        return null;
                                if ("signup".equalsIgnoreCase(request.getParameter("prompt"))
                                                || "signup".equalsIgnoreCase(request.getParameter("action"))) {
                                        String uri = req.getAuthorizationUri();
                                        if (uri != null && uri.contains("/oauth2/authorize")) {
                                                uri = uri.replace("/oauth2/authorize", "/signup");
                                                return OAuth2AuthorizationRequest.from(req)
                                                                .authorizationUri(uri)
                                                                .build();
                                        }
                                }
                                return req;
                        }
                };
        }

        @Bean
        public ActiveAccountFilter activeAccountFilter(UserRepository userRepository) {
                return new ActiveAccountFilter(userRepository);
        }

        @Bean
        public FilterRegistrationBean<ActiveAccountFilter> disableServletFilterRegistration(
                        ActiveAccountFilter activeAccountFilter) {
                FilterRegistrationBean<ActiveAccountFilter> registration = new FilterRegistrationBean<>(
                                activeAccountFilter);
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
