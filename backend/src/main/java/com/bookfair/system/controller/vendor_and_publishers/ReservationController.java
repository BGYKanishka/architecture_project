package com.bookfair.system.controller.vendor_and_publishers;

import com.bookfair.system.dto.request.ReservationRequest;
import com.bookfair.system.dto.response.ReservationResponse;
import com.bookfair.system.service.ReservationService;
import com.bookfair.system.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendor-publishers/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<?> makeReservation(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @Valid @RequestBody ReservationRequest request) {
        try {
            ReservationResponse response = reservationService.createReservation(currentUser.getId(), request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getReservationCount(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        long count = reservationService.getReservationCount(currentUser.getId());
        return ResponseEntity.ok(count);
    }

    @GetMapping("/my")
    public ResponseEntity<java.util.List<com.bookfair.system.dto.response.UserReservationResponse>> getMyReservations(
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        System.out.println("Fetching reservations for user ID: " + currentUser.getId());
        java.util.List<com.bookfair.system.dto.response.UserReservationResponse> reservations = reservationService
                .getUserReservations(currentUser.getId());
        System.out.println("Found " + reservations.size() + " reservations for user ID: " + currentUser.getId());
        return ResponseEntity.ok(reservations);
    }

    @DeleteMapping("/{stallId}")
    public ResponseEntity<?> cancelReservation(@AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long stallId) {
        try {
            reservationService.cancelStallReservation(currentUser.getId(), stallId);
            return ResponseEntity.ok("Reservation cancelled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}