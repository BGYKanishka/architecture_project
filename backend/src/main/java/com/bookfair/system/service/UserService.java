package com.bookfair.system.service;

import com.bookfair.system.dto.request.UserProfileUpdateRequest;
import com.bookfair.system.dto.UserProfileResponse;
import com.bookfair.system.dto.request.ChangePasswordRequest;
import com.bookfair.system.entity.Genre;
import com.bookfair.system.entity.User;
import com.bookfair.system.repository.GenreRepository;
import com.bookfair.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
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
  private final PasswordEncoder passwordEncoder;

  @Transactional(readOnly = true)
  public UserProfileResponse getUserProfile(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

    return toProfileResponse(user);
  }

  @Transactional
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

  public void changePassword(String email, ChangePasswordRequest request) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
      throw new IllegalArgumentException("Incorrect current password");
    }

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
  }

  private UserProfileResponse toProfileResponse(User user) {
    List<String> genreNames = (user.getGenres() == null) ? List.of()
        : user.getGenres().stream()
            .map(Genre::getName)
            .collect(Collectors.toList());

    return UserProfileResponse.builder()
        .name(user.getName())
        .email(user.getEmail())
        .contactNumber(user.getContactNumber())
        .businessName(user.getBusinessName())
        .role(user.getRole())
        .genres(genreNames)
        .build();
  }
}