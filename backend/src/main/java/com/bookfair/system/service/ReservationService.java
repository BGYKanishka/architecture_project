package com.bookfair.system.service;

import com.bookfair.system.dto.request.ReservationRequest;
import com.bookfair.system.dto.response.AdminReservationResponse;
import com.bookfair.system.dto.response.ReservationResponse;
import com.bookfair.system.entity.*;
import com.bookfair.system.repository.*;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationStallRepository reservationStallRepository;
    private final StallRepository stallRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final EmailService emailService;

    @Transactional
    public ReservationResponse createReservation(Long userId, ReservationRequest request) {

        if (request == null || request.getStallIds() == null || request.getStallIds().isEmpty()) {
            throw new IllegalArgumentException("Select at least one stall.");
        }
        if (request.getStallIds().size() > 3) {
            throw new IllegalArgumentException("You can reserve at most 3 stalls at a time.");
        }
        if (new HashSet<>(request.getStallIds()).size() != request.getStallIds().size()) {
            throw new IllegalArgumentException("A stall can only be selected once.");
        }
        if (request.getStallIds().stream().anyMatch(stallId -> stallId == null || stallId <= 0)) {
            throw new IllegalArgumentException("Stall IDs must be positive values.");
        }
        String paymentMethod = (request.getPaymentMethod() == null || request.getPaymentMethod().isBlank())
                ? "CASH_ON_DATE"
                : request.getPaymentMethod().trim().toUpperCase(Locale.ROOT);
        if (!"CASH_ON_DATE".equals(paymentMethod)) {
            throw new IllegalArgumentException("Unsupported payment method.");
        }

        // 1. Validate User
        User user = userRepository.findByIdForUpdate(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        // 2. Validate Limit (Max 3 stalls)
        long currentBookings = reservationStallRepository.countStallsByUserId(userId);
        if (currentBookings + request.getStallIds().size() > 3) {
            throw new IllegalStateException("You can only reserve up to 3 active stalls per business.");
        }

        // 3. Set Status (Matches your DB Constraints: PENDING, CONFIRMED)
        String reservationStatus = "CONFIRMED";
        String paymentStatus = "PENDING";

        // 4. Create Reservation Object
        String qrToken = "RES-" + UUID.randomUUID().toString().toUpperCase(Locale.ROOT);

        Reservation reservation = Reservation.builder()
                .user(user)
                .status(reservationStatus)
                .qrCodeToken(qrToken)
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);

        // 5. Process Stalls with Pessimistic Locking to prevent double-booking race conditions
        List<Long> sortedStallIds = new ArrayList<>(request.getStallIds());
        Collections.sort(sortedStallIds); // Canonical lock order to prevent deadlocks

        List<Stall> stalls = new ArrayList<>();
        double calculatedTotal = 0.0;

        for (Long stallId : sortedStallIds) {
            // Lock the stall row exclusively (SELECT ... FOR UPDATE)
            Stall stall = stallRepository.findByIdWithLock(stallId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stall not found."));

            if (stall.isReserved()) {
                throw new IllegalStateException("Stall " + stall.getStallCode() + " is already reserved.");
            }
            if (stall.isDisabled()) {
                throw new IllegalStateException("Stall " + stall.getStallCode() + " is disabled and unavailable.");
            }

            // Link Stall to Reservation
            reservationStallRepository.save(
                    ReservationStall.builder()
                            .reservation(savedReservation)
                            .stall(stall)
                            .build());

            // Mark reserved and persist
            stall.setReserved(true);
            stallRepository.save(stall);

            calculatedTotal += stall.getPrice();
            stalls.add(stall);
        }

        // 6. Create Payment Record
        Payment payment = new Payment();
        payment.setReservation(savedReservation);
        payment.setAmount(calculatedTotal);
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentStatus(paymentStatus);

        paymentRepository.save(payment);

        // 7. Generate QR & Send Email
        try {
            String qrImageBase64 = generateQRCodeImage(qrToken);
            String stallDetails = stalls.stream()
                    .map(s -> s.getStallCode() + " (" + s.getSize() + ")")
                    .collect(Collectors.joining(", "));

            emailService.sendReservationEmail(
                    user.getEmail(),
                    user.getName(),
                    user.getContactNumber() != null ? user.getContactNumber() : "N/A",
                    paymentStatus,
                    qrImageBase64,
                    stallDetails);

            return ReservationResponse.builder()
                    .reservationCode(qrToken)
                    .qrCodeImage(qrImageBase64)
                    .message("Booking Successful!")
                    .build();

        } catch (Exception e) {
            log.error("QR or Email delivery error during reservation creation for user ID {}: {}", userId, e.getMessage(), e);
            return ReservationResponse.builder()
                    .reservationCode(qrToken)
                    .message("Booking Success (Email Failed)")
                    .build();
        }
    }

    private String generateQRCodeImage(String text) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 250, 250);
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return Base64.getEncoder().encodeToString(pngOutputStream.toByteArray());
    }

    @Transactional(readOnly = true)
    public List<AdminReservationResponse> getAllReservations() {
        List<Reservation> baseReservations = reservationRepository.findAllBaseReservationsWithUser();
        List<ReservationStall> allStalls = reservationStallRepository.findAllWithStallsAndReservations();

        Map<Long, List<ReservationStall>> stallsByReservationId = allStalls.stream()
                .filter(rs -> rs.getReservation() != null && rs.getReservation().getId() != null)
                .collect(Collectors.groupingBy(rs -> rs.getReservation().getId()));

        return baseReservations.stream().map(r -> {
            List<AdminReservationResponse.StallDetail> stallDetails = stallsByReservationId
                    .getOrDefault(r.getId(), Collections.emptyList())
                    .stream()
                    .map(rs -> new AdminReservationResponse.StallDetail(
                            rs.getStall().getId(),
                            rs.getStall().getStallCode(),
                            rs.getReservation().getStatus()))
                    .collect(Collectors.toList());

            return new AdminReservationResponse(
                    r.getId(),
                    r.getUser().getEmail(),
                    r.getUser().getName(),
                    r.getReservationDate(),
                    r.getQrCodeToken(),
                    r.getStatus(),
                    stallDetails);
        }).collect(Collectors.toList());
    }

    @Transactional
    public AdminReservationResponse updateReservationStatus(Long id, String status) {
        // Use JOIN FETCH to load User eagerly before updating
        Reservation reservation = reservationRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found."));
        String normalizedStatus = status == null ? "" : status.trim().toUpperCase(Locale.ROOT);
        if (!Set.of("PENDING", "CONFIRMED", "CANCELLED").contains(normalizedStatus)) {
            throw new IllegalArgumentException("Unsupported reservation status.");
        }

        String currentStatus = reservation.getStatus();
        if ("CANCELLED".equals(currentStatus) && !"CANCELLED".equals(normalizedStatus)) {
            throw new IllegalStateException("A cancelled reservation cannot be reactivated.");
        }

        if (!"CANCELLED".equals(currentStatus) && "CANCELLED".equals(normalizedStatus)) {
            List<Long> stallIds = reservationStallRepository.findAllByReservationId(id).stream()
                    .map(reservationStall -> reservationStall.getStall().getId())
                    .distinct()
                    .sorted()
                    .toList();
            for (Long stallId : stallIds) {
                Stall stall = stallRepository.findByIdWithLock(stallId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stall not found."));
                stall.setReserved(false);
                stallRepository.save(stall);
            }
        }

        reservation.setStatus(normalizedStatus);
        Reservation saved = reservationRepository.save(reservation);
        return new AdminReservationResponse(
                saved.getId(),
                saved.getUser().getEmail(),
                saved.getUser().getName(),
                saved.getReservationDate(),
                saved.getQrCodeToken(),
                saved.getStatus(),
                java.util.Collections.emptyList());
    }

    public long getReservationCount(Long userId) {
        return reservationStallRepository.countStallsByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getUserReservations(Long userId) {
        List<ReservationStall> reservationStalls = reservationStallRepository.findAllByReservationUserId(userId);

        return reservationStalls.stream().map(rs -> {
            Stall stall = rs.getStall();
            Reservation reservation = rs.getReservation();
            String code = reservation.getQrCodeToken();
            if (code.contains("-C-"))
                code = code.substring(0, code.indexOf("-C-"));

            String qrCodeImage = null;
            try {
                qrCodeImage = generateQRCodeImage(code);
            } catch (Exception e) {
                log.error("Failed to generate QR code for reservation code {}: {}", code, e.getMessage(), e);
            }

            return ReservationResponse.builder()
                    .id(stall.getId())
                    .stallCode(stall.getStallCode())
                    .size(stall.getSize())
                    .price(stall.getPrice())
                    .floorName(stall.getFloor().getFloorName())
                    .reservationCode(code)
                    .qrCodeImage(qrCodeImage)
                    .status(reservation.getStatus())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public void cancelStallReservation(Long userId, Long stallId) {
        ReservationStall initialReservationStall = reservationStallRepository
                .findActiveByUserIdAndStallId(userId, stallId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Active reservation not found for this stall."));

        Long reservationId = initialReservationStall.getReservation().getId();
        Reservation originalReservation = reservationRepository.findByIdForUpdate(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found."));
        Stall stall = stallRepository.findByIdWithLock(stallId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stall not found."));
        ReservationStall reservationStall = reservationStallRepository
                .findActiveByUserIdAndStallId(userId, stallId)
                .filter(active -> active.getReservation().getId().equals(reservationId))
                .orElseThrow(() -> new IllegalStateException("Reservation changed while cancellation was in progress."));

        stall.setReserved(false);
        stallRepository.save(stall);

        long remainingStalls = reservationStallRepository.countByReservationId(originalReservation.getId());

        if (remainingStalls <= 1) {
            originalReservation.setStatus("CANCELLED");
            reservationRepository.save(originalReservation);
        } else {
            Reservation cancelledRes = new Reservation();
            cancelledRes.setUser(originalReservation.getUser());
            cancelledRes.setReservationDate(originalReservation.getReservationDate());
            cancelledRes.setStatus("CANCELLED");
            cancelledRes.setQrCodeToken(originalReservation.getQrCodeToken() + "-C-" + stall.getId());
            reservationRepository.save(cancelledRes);

            reservationStall.setReservation(cancelledRes);
            reservationStallRepository.save(reservationStall);
        }
    }
}
