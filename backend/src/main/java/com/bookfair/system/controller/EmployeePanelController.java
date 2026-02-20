package com.bookfair.system.controller;

import com.bookfair.system.dto.EmployeeStallDetailsDto;
import com.bookfair.system.entity.Reservation;
import com.bookfair.system.entity.Stall;
import com.bookfair.system.repository.PaymentRepository;
import com.bookfair.system.repository.ReservationStallRepository;
import com.bookfair.system.repository.StallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookfair.system.dto.response.QrVerificationResponse;
import com.bookfair.system.entity.Payment;
import com.bookfair.system.repository.ReservationRepository;
import com.bookfair.system.entity.ReservationStall;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeePanelController {

    private final StallRepository stallRepository;
    private final ReservationStallRepository reservationStallRepository;
    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    @GetMapping("/stalls")
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<EmployeeStallDetailsDto>> getAllStallsForEmployee() {
        List<Stall> allStalls = stallRepository.findAll();
        // Reservation and Payment fetching logic is inside the stream now or can be
        // optimized.
        // For simplicity and to match the existing pattern, let's keep it.
        // Note: The previous implementation fetched all reservations and payments which
        // might be inefficient but acceptable for now.

        List<EmployeeStallDetailsDto> stallDtos = allStalls.stream().map(this::mapToDto).collect(Collectors.toList());

        return ResponseEntity.ok(stallDtos);
    }

    @GetMapping("/stalls/{stallId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Transactional(readOnly = true)
    public ResponseEntity<EmployeeStallDetailsDto> getStallDetails(
            @PathVariable Long stallId) {
        return stallRepository.findById(stallId)
                .map(stall -> ResponseEntity.ok(mapToDto(stall)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/qr/{token}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Transactional(readOnly = true)
    public ResponseEntity<QrVerificationResponse> verifyQrCode(@PathVariable String token) {
        return reservationRepository.findByQrCodeTokenWithUser(token)
                .map(reservation -> {
                    boolean accessGranted = "CONFIRMED".equals(reservation.getStatus());

                    // Fetch related data
                    List<ReservationStall> reservationStalls = reservationStallRepository
                            .findAllByReservationId(reservation.getId());
                    Payment payment = paymentRepository.findByReservationId(reservation.getId()).orElse(null);

                    // Map to DTO
                    QrVerificationResponse response = buildQrResponse(reservation, reservationStalls, payment,
                            accessGranted);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.ok(QrVerificationResponse.builder()
                        .accessGranted(false)
                        .message("Invalid QR Code: Reservation not found.")
                        .build()));
    }

    private QrVerificationResponse buildQrResponse(Reservation r, List<ReservationStall> rStalls, Payment p,
            boolean granted) {
        String msg = granted ? "Access Granted: Valid Reservation."
                : "Access Denied: Reservation is " + r.getStatus() + ".";

        List<QrVerificationResponse.StallDetail> stallDetails = rStalls.stream()
                .map(rs -> QrVerificationResponse.StallDetail.builder()
                        .id(rs.getStall().getId())
                        .stallCode(rs.getStall().getStallCode())
                        .size(rs.getStall().getSize())
                        .floorName(rs.getStall().getFloor().getFloorName())
                        .price(rs.getStall().getPrice())
                        .build())
                .collect(Collectors.toList());

        QrVerificationResponse.PaymentDetail.PaymentDetailBuilder pdBuilder = QrVerificationResponse.PaymentDetail
                .builder();
        if (p != null) {
            pdBuilder.amount(p.getAmount())
                    .paymentStatus(p.getPaymentStatus())
                    .paymentMethod(p.getPaymentMethod());
        }

        return QrVerificationResponse.builder()
                .accessGranted(granted)
                .message(msg)
                .user(QrVerificationResponse.UserDetails.builder()
                        .id(r.getUser().getId())
                        .name(r.getUser().getName())
                        .email(r.getUser().getEmail())
                        .contactNumber(r.getUser().getContactNumber())
                        .businessName(r.getUser().getBusinessName())
                        .role(r.getUser().getRole())
                        .build())
                .reservation(QrVerificationResponse.ReservationDetails.builder()
                        .id(r.getId())
                        .status(r.getStatus())
                        .reservationDate(r.getReservationDate() != null ? r.getReservationDate().toString() : null)
                        .stalls(stallDetails)
                        .payment(p != null ? pdBuilder.build() : null)
                        .build())
                .build();
    }

    private EmployeeStallDetailsDto mapToDto(Stall stall) {
        EmployeeStallDetailsDto dto = EmployeeStallDetailsDto.builder()
                .stallId(stall.getId())
                .stallCode(stall.getStallCode())
                .stallType(stall.getStallType().getSize())
                .stallSize(stall.getSize())
                .price(stall.getPrice())
                .floorName(stall.getFloor().getFloorName())
                .reserved(stall.isReserved())
                .disabled(stall.isDisabled())
                .build();

        if (stall.isReserved()) {
            reservationStallRepository
                    .findByStall_IdAndReservation_StatusIn(stall.getId(), List.of("CONFIRMED", "PENDING"))
                    .ifPresent(rs -> {
                        Reservation reservation = rs.getReservation();
                        dto.setVendorName(reservation.getUser().getName());
                        dto.setVendorEmail(reservation.getUser().getEmail());
                        dto.setVendorContact(reservation.getUser().getContactNumber());
                        dto.setBusinessName(reservation.getUser().getBusinessName());

                        // Generate QR data string (JSON format)
                        String qrData = String.format(
                                "{\"stall\":\"%s\",\"vendor\":\"%s\",\"contact\":\"%s\",\"resId\":\"%d\"}",
                                stall.getStallCode(),
                                reservation.getUser().getName(),
                                reservation.getUser().getEmail(),
                                reservation.getId());
                        dto.setQrCodeData(qrData);

                        paymentRepository.findByReservationId(reservation.getId()).ifPresent(payment -> {
                            dto.setPaymentStatus(payment.getPaymentStatus());
                            dto.setPaymentAmount(payment.getAmount());
                            dto.setPaymentDate(payment.getPaymentDate());
                            dto.setPaymentMethod(payment.getPaymentMethod());
                        });
                    });
        }
        return dto;
    }
}
