package com.bookfair.system.service;

import com.bookfair.system.dto.request.UserProfileUpdateRequest;
import com.bookfair.system.dto.UserProfileResponse;
import com.bookfair.system.entity.User;
import com.bookfair.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserProfileResponse getUserProfile(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

    return toProfileResponse(user);
  }

  public UserProfileResponse updateProfile(String email, UserProfileUpdateRequest request) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

    if (request.getName() != null && !request.getName().isEmpty()) {
      user.setName(request.getName());
    }
    if (request.getContactNumber() != null && !request.getContactNumber().isEmpty()) {
      user.setContactNumber(request.getContactNumber());
    }
    if (request.getBusinessName() != null && !request.getBusinessName().isEmpty()) {
      user.setBusinessName(request.getBusinessName());
    }
    if (request.getGenres() != null) {
      user.setGenres(request.getGenres());
    }

    userRepository.save(user);

    return toProfileResponse(user);
  }

  public void changePassword(String email, com.bookfair.system.dto.request.ChangePasswordRequest request) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
      throw new IllegalArgumentException("Incorrect current password");
    }

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
  }

  public java.util.List<UserProfileResponse> getEmployees() {
    return userRepository.findByRole("EMPLOYEE").stream()
        .map(this::toProfileResponse)
        .collect(java.util.stream.Collectors.toList());
  }

  private UserProfileResponse toProfileResponse(User user) {
    return UserProfileResponse.builder()
        .id(user.getId())
        .name(user.getName())
        .email(user.getEmail())
        .contactNumber(user.getContactNumber())
        .businessName(user.getBusinessName())
        .role(user.getRole())
        .genres(user.getGenres())
        .build();
  }
}
