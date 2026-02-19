package com.bookfair.system.config;

import com.bookfair.system.entity.User;
import com.bookfair.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            seedUser("vendor@test.com", "Test Vendor", "password123", "ROLE_VENDOR");
            seedUser("employee@test.com", "Test Employee", "password123", "ROLE_EMPLOYEE");
            seedUser("admin@test.com", "Test Admin", "password123", "ROLE_ADMIN");
        };
    }

    private void seedUser(String email, String name, String password, String role) {
        try {
            if (userRepository.findByEmail(email).isEmpty()) {
                User user = User.builder()
                        .name(name)
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .role(role)
                        .contactNumber("1234567890")
                        .businessName(role.equals("ROLE_VENDOR") ? "Test Vendor Business" : null)
                        .enabled(true)
                        .build();
                userRepository.save(user);
                System.out.println("Seeded user: " + email);
            } else {
                System.out.println("User already exists: " + email);
            }
        } catch (Exception e) {
            System.err.println("Failed to seed user: " + email);
            e.printStackTrace();
        }
    }
}
