package com.bookfair.system.service;

import com.bookfair.system.dto.UserProfileResponse;
import com.bookfair.system.dto.request.AdminCreateUserRequest;
import com.bookfair.system.dto.request.AdminUpdateUserRequest;
import com.bookfair.system.dto.request.UserProfileUpdateRequest;
import com.bookfair.system.entity.Genre;
import com.bookfair.system.entity.User;
import com.bookfair.system.repository.GenreRepository;
import com.bookfair.system.repository.ReservationRepository;
import com.bookfair.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

  private final UserRepository userRepository;
  private final GenreRepository genreRepository;
  private final ReservationRepository reservationRepository;
  private final EmailService emailService;

  /** Thrown when a user cannot be deleted due to FK-linked reservations. */
  public static class UserHasReservationsException extends RuntimeException {
    private final long count;

    public UserHasReservationsException(long count) {
      super("User has " + count + " reservation(s)");
      this.count = count;
    }

    public long getCount() {
      return count;
    }
  }

  // ─── User self-service ─────────────────────────────────────

  @Transactional(readOnly = true)
  public UserProfileResponse getUserProfileByCognitoSub(String cognitoSub) {
    User user = userRepository.findByCognitoSub(cognitoSub)
        .orElseThrow(() -> new UsernameNotFoundException("Cognito user profile not found."));
    return toProfileResponse(user);
  }

  @Transactional
  public UserProfileResponse updateProfileByCognitoSub(String cognitoSub, UserProfileUpdateRequest request) {
    User user = userRepository.findByCognitoSub(cognitoSub)
        .orElseThrow(() -> new UsernameNotFoundException("Cognito user profile not found."));

    if (request.getName() != null && !request.getName().isEmpty())
      user.setName(request.getName());
    if (request.getContactNumber() != null && !request.getContactNumber().isEmpty())
      user.setContactNumber(request.getContactNumber());
    if (request.getBusinessName() != null && !request.getBusinessName().isEmpty())
      user.setBusinessName(request.getBusinessName());

    // Keeping MAIN's logic: safely parsing strings into Genre entities
    if (request.getGenres() != null) {
      Set<Genre> genreEntities = new HashSet<>();

      for (String rawGenreName : request.getGenres()) {
        String cleanName = rawGenreName.trim();

        Genre genre = genreRepository.findByNameIgnoreCase(cleanName)
            .orElseThrow(() -> {
              log.error("Genre not found in database: '{}'", cleanName);
              return new IllegalArgumentException("Invalid genre: " + cleanName);
            });

        genreEntities.add(genre);
      }
      user.setGenres(genreEntities);
    }

    userRepository.save(user);
    return toProfileResponse(user);
  }

  public List<UserProfileResponse> getEmployees() {
    return userRepository.findByRole("EMPLOYEE").stream()
        .map(this::toAdminResponse)
        .collect(Collectors.toList());
  }

  // ─── Admin CRUD ────────────────────────────────────────────

  @Transactional(readOnly = true)
  public List<UserProfileResponse> getAllUsers(String role) {
    List<User> users = (role != null && !role.isBlank())
        ? userRepository.findByRole(role.toUpperCase())
        : userRepository.findAll();
    return users.stream().map(this::toAdminResponse).collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public UserProfileResponse getUserById(Long id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    return toAdminResponse(user);
  }

  @Transactional
  public UserProfileResponse createUser(AdminCreateUserRequest request) {
    String email = request.getEmail().trim().toLowerCase(java.util.Locale.ROOT);
    if (userRepository.existsByEmailIgnoreCase(email))
      throw new IllegalArgumentException("Email already in use.");

    User user = User.builder()
        .name(request.getName())
        .email(email)
        .role(request.getRole().toUpperCase())
        .contactNumber(request.getContactNumber())
        .businessName(request.getBusinessName())
        .enabled(true)
        .build();

    User savedUser = userRepository.save(user);

    // Asynchronously notify user with instructions to sign up and set their password
    emailService.sendAccountInvitationEmail(savedUser.getEmail(), savedUser.getName(), savedUser.getRole());

    return toAdminResponse(savedUser);
  }

  @Transactional
  public UserProfileResponse updateUser(Long id, AdminUpdateUserRequest request) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

    if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
      if (user.getCognitoSub() != null)
        throw new IllegalArgumentException("Change this user's email in Cognito and verify the new address first.");
      String email = request.getEmail().trim().toLowerCase(java.util.Locale.ROOT);
      if (userRepository.existsByEmailIgnoreCase(email))
        throw new IllegalArgumentException("Email already in use.");
      user.setEmail(email);
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
    return toAdminResponse(userRepository.save(user));
  }

  @Transactional
  public void deleteUser(Long id) {
    if (!userRepository.existsById(id))
      throw new RuntimeException("User not found with id: " + id);

    long reservationCount = reservationRepository.countByUserId(id);
    if (reservationCount > 0)
      throw new UserHasReservationsException(reservationCount);

    userRepository.deleteById(id);
  }

  @Transactional
  public UserProfileResponse toggleEnabled(Long id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    user.setEnabled(!Boolean.TRUE.equals(user.getEnabled()));
    return toAdminResponse(userRepository.save(user));
  }

  private UserProfileResponse toAdminResponse(User user) {
    return UserProfileResponse.builder()
        .id(user.getId())
        .name(user.getName())
        .email(user.getEmail())
        .contactNumber(user.getContactNumber())
        .businessName(user.getBusinessName())
        .role(user.getRole())
        .enabled(user.getEnabled())
        .createdAt(user.getCreatedAt())
        .build();
  }

  private UserProfileResponse toProfileResponse(User user) {
    List<String> genreNames = (user.getGenres() == null) ? List.of()
        : user.getGenres().stream()
        .map(genre -> genre.getName())
        .collect(Collectors.toList());

    return UserProfileResponse.builder()
        .id(user.getId())
        .name(user.getName())
        .email(user.getEmail())
        .contactNumber(user.getContactNumber())
        .businessName(user.getBusinessName())
        .role(user.getRole())
        .enabled(user.getEnabled())
        .createdAt(user.getCreatedAt())
        .genres(genreNames)
        .build();
  }
}
