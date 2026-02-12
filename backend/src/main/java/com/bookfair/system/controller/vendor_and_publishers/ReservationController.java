package com.bookfair.system.controller.vendor_and_publishers;

import com.bookfair.system.dto.request.ReservationRequest;
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
            String result = reservationService.createReservation(currentUser.getId(), request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}