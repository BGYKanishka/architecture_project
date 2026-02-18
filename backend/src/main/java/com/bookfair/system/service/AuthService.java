package com.bookfair.system.service;

import com.bookfair.system.dto.request.LoginRequest;
import com.bookfair.system.dto.request.SignupRequest;
import com.bookfair.system.dto.response.JwtResponse;
import com.bookfair.system.entity.User;
import com.bookfair.system.repository.UserRepository;
import com.bookfair.system.security.jwt.JwtUtils;
import com.bookfair.system.security.services.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        assert userDetails != null;
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getEmail(), roles);
    }

    public String registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role(signUpRequest.getRole().toUpperCase())
                .contactNumber(signUpRequest.getContactNumber())
                .businessName(signUpRequest.getBusinessName())
                .enabled(true)
                .build();

        userRepository.save(user);
        return "User registered successfully!";
    }
}

// package com.bookfair.system.service;

// import com.bookfair.system.dto.request.AdminLoginRequest;
// import com.bookfair.system.dto.response.LoginResponse;
// import com.bookfair.system.entity.User;
// import com.bookfair.system.repository.UserRepository;
// import org.springframework.stereotype.Service;

// @Service
// public class AuthService {

// private final UserRepository userRepository;
// // private final JwtUtil jwtUtil; // use your existing JWT class

// public AuthService(UserRepository userRepository /*, JwtUtil jwtUtil */) {
// this.userRepository = userRepository;
// // this.jwtUtil = jwtUtil;
// }

// public LoginResponse adminLogin(AdminLoginRequest req) {
// User user = userRepository.findByUsername(req.getUsername())
// .orElseThrow(() -> new RuntimeException("User not found"));

// // ⚠️ Learning mode password check:
// if (!user.getPassword().equals(req.getPassword())) {
// throw new RuntimeException("Invalid password");
// }

// // Allow only ADMIN/EMPLOYEE
// String role = user.getRole();
// if (!"ROLE_ADMIN".equals(role) && !"ROLE_EMPLOYEE".equals(role)) {
// throw new RuntimeException("Not an admin/employee account");
// }

// // TODO: generate token using your JWT util
// String token = "PUT_YOUR_JWT_HERE"; // replace with
// jwtUtil.generateToken(user)

// return new LoginResponse(token, role, user.getUsername());
// }
// }