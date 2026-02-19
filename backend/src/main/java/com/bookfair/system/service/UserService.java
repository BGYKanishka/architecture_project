package com.bookfair.system.service;

import com.bookfair.system.dto.UserProfileResponse;
import com.bookfair.system.dto.request.AdminCreateUserRequest;
import com.bookfair.system.dto.request.AdminUpdateUserRequest;
import com.bookfair.system.dto.request.ChangePasswordRequest;
import com.bookfair.system.dto.request.UserProfileUpdateRequest;
import com.bookfair.system.entity.User;
import com.bookfair.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  // ─── User self-service ─────────────────────────────────────

  public UserProfileResponse getUserProfile(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    return toProfileResponse(user);
  }

  public UserProfileResponse updateProfile(String email, UserProfileUpdateRequest request) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

    if (request.getName() != null && !request.getName().isEmpty())
      user.setName(request.getName());
    if (request.getContactNumber() != null && !request.getContactNumber().isEmpty())
      user.setContactNumber(request.getContactNumber());
    if (request.getBusinessName() != null && !request.getBusinessName().isEmpty())
      user.setBusinessName(request.getBusinessName());
    if (request.getGenres() != null)
      user.setGenres(request.getGenres());

    userRepository.save(user);
    return toProfileResponse(user);
  }

  public void changePassword(String email, ChangePasswordRequest request) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword()))
      throw new IllegalArgumentException("Incorrect current password");

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
  }

  public List<UserProfileResponse> getEmployees() {
    return userRepository.findByRole("EMPLOYEE").stream()
        .map(this::toProfileResponse)
        .collect(Collectors.toList());
  }

  // ─── Admin CRUD ────────────────────────────────────────────

  @Transactional(readOnly = true)
  public List<UserProfileResponse> getAllUsers(String role) {
    List<User> users = (role != null && !role.isBlank())
        ? userRepository.findByRole(role.toUpperCase())
        : userRepository.findAll();
    return users.stream().map(this::toProfileResponse).collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public UserProfileResponse getUserById(Long id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    return toProfileResponse(user);
  }

  @Transactional
  public UserProfileResponse createUser(AdminCreateUserRequest request) {
    if (userRepository.existsByEmail(request.getEmail()))
      throw new IllegalArgumentException("Email already in use: " + request.getEmail());

    User user = User.builder()
        .name(request.getName())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(request.getRole().toUpperCase())
        .contactNumber(request.getContactNumber())
        .businessName(request.getBusinessName())
        .enabled(true)
        .build();

    return toProfileResponse(userRepository.save(user));
  }

  @Transactional
  public UserProfileResponse updateUser(Long id, AdminUpdateUserRequest request) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

    // Check email uniqueness if email is being changed
    if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
      if (userRepository.existsByEmail(request.getEmail()))
        throw new IllegalArgumentException("Email already in use: " + request.getEmail());
      user.setEmail(request.getEmail());
    }
    if (request.getName() != null && !request.getName().isBlank())
      user.setName(request.getName());
    if (request.getContactNumber() != null)
      user.setContactNumber(request.getContactNumber());
    if (request.getBusinessName() != null)
      user.setBusinessName(request.getBusinessName());
    if (request.getRole() != null && !request.getRole().isBlank())
      user.setRole(request.getRole().toUpperCase());
    if (request.getEnabled() != null)
      user.setEnabled(request.getEnabled());
    // Re-hash only if a new password is provided
    if (request.getPassword() != null && !request.getPassword().isBlank())
      user.setPassword(passwordEncoder.encode(request.getPassword()));

    return toProfileResponse(userRepository.save(user));
  }

  @Transactional
  public void deleteUser(Long id) {
    if (!userRepository.existsById(id))
      throw new RuntimeException("User not found with id: " + id);
    userRepository.deleteById(id);
  }

  @Transactional
  public UserProfileResponse toggleEnabled(Long id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    user.setEnabled(!Boolean.TRUE.equals(user.getEnabled()));
    return toProfileResponse(userRepository.save(user));
  }

  // ─── Mapper ────────────────────────────────────────────────

  private UserProfileResponse toProfileResponse(User user) {
    return UserProfileResponse.builder()
        .id(user.getId())
        .name(user.getName())
        .email(user.getEmail())
        .contactNumber(user.getContactNumber())
        .businessName(user.getBusinessName())
        .role(user.getRole())
        .enabled(user.getEnabled())
        .createdAt(user.getCreatedAt())
        .genres(user.getGenres())
        .build();
  }
}
