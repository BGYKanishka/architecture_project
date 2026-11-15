package com.bookfair.system.controller.vendor_and_publishers;

import com.bookfair.system.dto.request.ReservationRequest;
import com.bookfair.system.dto.response.ReservationResponse;
import com.bookfair.system.service.ReservationService;
import com.bookfair.system.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/vendor-publishers/reservations")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('VENDOR', 'EMPLOYEE', 'ADMIN')")
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> makeReservation(
            @AuthenticationPrincipal OidcUser currentUser,
            @Valid @RequestBody ReservationRequest request) {
        ReservationResponse response = reservationService.createReservation(userId(currentUser), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getReservationCount(@AuthenticationPrincipal OidcUser currentUser) {
        long count = reservationService.getReservationCount(userId(currentUser));
        return ResponseEntity.ok(count);
    }

    @GetMapping("/my")
    public ResponseEntity<java.util.List<ReservationResponse>> getMyReservations(
            @AuthenticationPrincipal OidcUser currentUser) {
        java.util.List<ReservationResponse> reservations = reservationService
                .getUserReservations(userId(currentUser));
        return ResponseEntity.ok(reservations);
    }

    @DeleteMapping("/{stallId}")
    public ResponseEntity<?> cancelReservation(@AuthenticationPrincipal OidcUser currentUser,
            @PathVariable Long stallId) {
        reservationService.cancelStallReservation(userId(currentUser), stallId);
        return ResponseEntity.ok("Reservation cancelled successfully");
    }

    private Long userId(OidcUser currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated.");
        }
        String sub = currentUser.getSubject();
        String email = currentUser.getEmail();
        return userRepository.findByCognitoSub(sub)
                .or(() -> (email != null && !email.isBlank())
                        ? userRepository.findByEmailIgnoreCase(email.trim().toLowerCase(java.util.Locale.ROOT))
                                .map(user -> {
                                    if (user.getCognitoSub() == null || user.getCognitoSub().isBlank()) {
                                        user.setCognitoSub(sub);
                                        return userRepository.save(user);
                                    }
                                    return user;
                                })
                        : java.util.Optional.empty())
                .map(user -> user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account profile not found."));
    }
}
