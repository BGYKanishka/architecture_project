package com.bookfair.system.controller.vendor_and_publishers;

import com.bookfair.system.dto.request.ReservationRequest;
import com.bookfair.system.dto.response.ReservationResponse;
import com.bookfair.system.service.ReservationService;
import com.bookfair.system.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendor-publishers/reservations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VENDOR')")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<?> makeReservation(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @Valid @RequestBody ReservationRequest request) {
        ReservationResponse response = reservationService.createReservation(currentUser.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getReservationCount(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        long count = reservationService.getReservationCount(currentUser.getId());
        return ResponseEntity.ok(count);
    }

    @GetMapping("/my")
    public ResponseEntity<java.util.List<ReservationResponse>> getMyReservations(
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        java.util.List<ReservationResponse> reservations = reservationService
                .getUserReservations(currentUser.getId());
        return ResponseEntity.ok(reservations);
    }

    @DeleteMapping("/{stallId}")
    public ResponseEntity<?> cancelReservation(@AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long stallId) {
        reservationService.cancelStallReservation(currentUser.getId(), stallId);
        return ResponseEntity.ok("Reservation cancelled successfully");
    }
}
