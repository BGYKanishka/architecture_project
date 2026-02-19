package com.bookfair.system.service;

import com.bookfair.system.dto.response.StallAvailabilityResponse;
import com.bookfair.system.entity.Reservation;
import com.bookfair.system.entity.ReservationStall;
import com.bookfair.system.entity.Stall;
import com.bookfair.system.entity.User;
import com.bookfair.system.repository.ReservationStallRepository;
import com.bookfair.system.repository.StallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StallService {

    private final StallRepository stallRepository;
    private final ReservationStallRepository reservationStallRepository;

    // ─── Existing CRUD (kept for backward compatibility) ───────

    public List<Stall> getAllStalls() {
        return stallRepository.findAllWithFloors();
    }

    public Optional<Stall> getStallById(Long id) {
        return stallRepository.findById(id);
    }

    @Transactional
    public Stall createStall(Stall stall) {
        return stallRepository.save(stall);
    }

    @Transactional
    public Stall updateStall(Long id, Stall stallDetails) {
        Stall stall = stallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stall not found with id: " + id));
        stall.setStallCode(stallDetails.getStallCode());
        stall.setStallType(stallDetails.getStallType());
        stall.setFloor(stallDetails.getFloor());
        return stallRepository.save(stall);
    }

    @Transactional
    public void deleteStall(Long id) {
        Stall stall = stallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stall not found with id: " + id));
        stallRepository.delete(stall);
    }

    // ─── Availability view ────────────────────────────────────

    /**
     * Returns a rich list of all stalls with vendor details when reserved.
     * Stall + StallType + Floor are EAGER so no lazy-load risk here.
     * Vendor info is fetched only for reserved stalls via findActiveByStallId.
     */
    @Transactional(readOnly = true)
    public List<StallAvailabilityResponse> getStallAvailability() {
        return stallRepository.findAllWithFloors().stream()
                .map(this::toAvailabilityResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public StallAvailabilityResponse toggleDisabled(Long id) {
        Stall stall = stallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stall not found with id: " + id));
        if (stall.isReserved()) {
            throw new IllegalStateException(
                    "Cannot disable a reserved stall. Please wait until the reservation ends.");
        }
        stall.setDisabled(!stall.isDisabled());
        return toAvailabilityResponse(stallRepository.save(stall));
    }

    // ─── Mapper ───────────────────────────────────────────────

    private StallAvailabilityResponse toAvailabilityResponse(Stall stall) {
        String statusLabel;
        if (stall.isDisabled()) {
            statusLabel = "DISABLED";
        } else if (stall.isReserved()) {
            statusLabel = "RESERVED";
        } else {
            statusLabel = "AVAILABLE";
        }

        StallAvailabilityResponse.StallAvailabilityResponseBuilder builder = StallAvailabilityResponse.builder()
                .id(stall.getId())
                .stallCode(stall.getStallCode())
                .floorName(stall.getFloor().getFloorName())
                .floorId(stall.getFloor().getId())
                .size(stall.getSize())
                .price(stall.getPrice())
                .reserved(stall.isReserved())
                .disabled(stall.isDisabled())
                .statusLabel(statusLabel);

        // Fetch vendor info only if reserved
        if (stall.isReserved()) {
            Optional<ReservationStall> rs = reservationStallRepository.findActiveByStallId(stall.getId());
            rs.ifPresent(link -> {
                Reservation reservation = link.getReservation();
                User vendor = reservation.getUser();
                builder.reservationId(reservation.getId())
                        .reservationDate(reservation.getReservationDate())
                        .reservationStatus(reservation.getStatus())
                        .vendorId(vendor.getId())
                        .vendorName(vendor.getName())
                        .vendorEmail(vendor.getEmail())
                        .vendorContact(vendor.getContactNumber())
                        .vendorBusiness(vendor.getBusinessName());
            });
        }

        return builder.build();
    }
}
