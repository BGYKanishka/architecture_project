package com.bookfair.system.controller.vendor_and_publishers;

import com.bookfair.system.dto.response.StallResponse;
import com.bookfair.system.entity.Floor;
import com.bookfair.system.entity.Reservation;
import com.bookfair.system.entity.ReservationStall;
import com.bookfair.system.entity.Stall;
import com.bookfair.system.repository.FloorRepository;
import com.bookfair.system.repository.ReservationStallRepository;
import com.bookfair.system.repository.StallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stalls")
@RequiredArgsConstructor
public class StallController {

    private final StallRepository stallRepository;
    private final FloorRepository floorRepository;
    private final ReservationStallRepository reservationStallRepository;

    @GetMapping("/halls")
    public ResponseEntity<List<Floor>> getAllHalls() {
        return ResponseEntity.ok(floorRepository.findAll());
    }

    @GetMapping
    public ResponseEntity<List<StallResponse>> getAllStalls(@RequestParam(required = false) Long floorId) {
        List<Stall> stalls;

        if (floorId != null) {
            stalls = stallRepository.findByFloorId(floorId);
        } else {
            stalls = stallRepository.findAllWithFloors();
        }

        boolean isStaffOrAdmin = isStaffOrAdmin();
        Map<Long, ReservationStall> reservationByStallId = isStaffOrAdmin
                ? getActiveReservationsMap()
                : Map.of();

        List<StallResponse> response = stalls.stream().map(stall -> {
            StallResponse.StallResponseBuilder builder = StallResponse.builder()
                    .id(stall.getId())
                    .stallCode(stall.getStallCode())
                    .size(stall.getSize())
                    .price(stall.getPrice())
                    .reserved(stall.isReserved())
                    .disabled(stall.isDisabled())
                    .floorName(stall.getFloor().getFloorName());

            if (isStaffOrAdmin && stall.isReserved() && reservationByStallId.containsKey(stall.getId())) {
                Reservation r = reservationByStallId.get(stall.getId()).getReservation();
                if (r != null && r.getUser() != null) {
                    builder.vendorName(r.getUser().getName());
                    builder.businessName(r.getUser().getBusinessName());
                }
            }

            return builder.build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{stallId}")
    public ResponseEntity<StallResponse> getStallById(@PathVariable Long stallId) {
        return stallRepository.findById(stallId).map(stall -> {
            boolean isStaffOrAdmin = isStaffOrAdmin();
            StallResponse.StallResponseBuilder builder = StallResponse.builder()
                    .id(stall.getId())
                    .stallCode(stall.getStallCode())
                    .size(stall.getSize())
                    .price(stall.getPrice())
                    .reserved(stall.isReserved())
                    .disabled(stall.isDisabled())
                    .floorName(stall.getFloor().getFloorName());

            if (isStaffOrAdmin && stall.isReserved()) {
                reservationStallRepository
                        .findByStall_IdAndReservation_StatusIn(stall.getId(), List.of("CONFIRMED", "PENDING"))
                        .ifPresent(rs -> {
                            Reservation r = rs.getReservation();
                            if (r != null && r.getUser() != null) {
                                builder.vendorName(r.getUser().getName());
                                builder.businessName(r.getUser().getBusinessName());
                            }
                        });
            }

            return ResponseEntity.ok(builder.build());
        }).orElse(ResponseEntity.notFound().build());
    }

    private boolean isStaffOrAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }
        return auth.getAuthorities().stream().anyMatch(a ->
                "ROLE_EMPLOYEE".equals(a.getAuthority()) || "ROLE_ADMIN".equals(a.getAuthority())
        );
    }

    private Map<Long, ReservationStall> getActiveReservationsMap() {
        try {
            return reservationStallRepository
                    .findAllActiveWithUser(List.of("CONFIRMED", "PENDING"))
                    .stream()
                    .collect(Collectors.toMap(rs -> rs.getStall().getId(), rs -> rs, (a, b) -> a));
        } catch (Exception e) {
            return Map.of();
        }
    }
}
