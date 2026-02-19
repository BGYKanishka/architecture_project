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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

        // 1. Validate User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Validate Limit (Max 3 stalls)
        long currentBookings = reservationStallRepository.countStallsByUserId(userId);
        if (currentBookings + request.getStallIds().size() > 3) {
            throw new RuntimeException("Limit Exceeded: You can only reserve up to 3 stalls per business.");
        }

        // 3. Set Status (Matches your DB Constraints: PENDING, CONFIRMED)
        String reservationStatus = "CONFIRMED";
        String paymentStatus = "PAID";

        if ("CASH_ON_DATE".equals(request.getPaymentMethod())) {
            reservationStatus = "CONFIRMED";
            paymentStatus = "PENDING";
        }

        // 4. Create Reservation Object
        String qrToken = "RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Reservation reservation = Reservation.builder()
                .user(user)
                .status(reservationStatus)
                .qrCodeToken(qrToken)
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);

        // 5. Process Stalls
        List<Stall> stalls = stallRepository.findAllById(request.getStallIds());
        double calculatedTotal = 0.0;

        for (Stall stall : stalls) {
            // SAFE CHECK: Only check the boolean flag on the Stall entity
            if (stall.isReserved()) {
                throw new RuntimeException("Stall " + stall.getStallCode() + " is already reserved!");
            }

            // Link Stall to Reservation
            reservationStallRepository.save(
                    ReservationStall.builder()
                            .reservation(savedReservation)
                            .stall(stall)
                            .build());

            // LOCK THE STALL
            stall.setReserved(true);
            stallRepository.save(stall);

            calculatedTotal += stall.getPrice();
        }

        // 6. Create Payment Record
        Payment payment = new Payment();
        payment.setReservation(savedReservation);
        payment.setAmount(calculatedTotal);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(paymentStatus);

        paymentRepository.save(payment);

        // 7. Generate QR & Send Email
        try {
            String qrImageBase64 = generateQRCodeImage(qrToken);
            String stallCodes = stalls.stream()
                    .map(Stall::getStallCode)
                    .collect(Collectors.joining(", "));

            emailService.sendReservationEmail(
                    user.getEmail(),
                    user.getName(),
                    qrImageBase64,
                    stallCodes);

            return ReservationResponse.builder()
                    .reservationCode(qrToken)
                    .qrCodeImage(qrImageBase64)
                    .message("Booking Successful!")
                    .build();

        } catch (Exception e) {
            System.err.println("QR/Email Error: " + e.getMessage());
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
        // JOIN FETCH loads User in a single SQL query — no LazyInitializationException
        return reservationRepository.findAllWithUser().stream()
                .map(r -> new AdminReservationResponse(
                        r.getId(),
                        r.getUser().getEmail(),
                        r.getUser().getName(),
                        r.getReservationDate(),
                        r.getQrCodeToken(),
                        r.getStatus()))
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminReservationResponse updateReservationStatus(Long id, String status) {
        // Use JOIN FETCH to load User eagerly before updating
        Reservation reservation = reservationRepository.findByIdWithUser(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
        reservation.setStatus(status);
        Reservation saved = reservationRepository.save(reservation);
        return new AdminReservationResponse(
                saved.getId(),
                saved.getUser().getEmail(),
                saved.getUser().getName(),
                saved.getReservationDate(),
                saved.getQrCodeToken(),
                saved.getStatus());
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
            String qrCodeImage = null;
            try {
                qrCodeImage = generateQRCodeImage(reservation.getQrCodeToken());
            } catch (Exception e) {
                e.printStackTrace();
            }

            return ReservationResponse.builder()
                    .id(stall.getId())
                    .stallCode(stall.getStallCode())
                    .size(stall.getSize())
                    .price(stall.getPrice())
                    .floorName(stall.getFloor().getFloorName())
                    .reservationCode(reservation.getQrCodeToken()) // Mapped from reservationId -> reservationCode
                    .qrCodeImage(qrCodeImage)
                    .status(reservation.getStatus())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public void cancelStallReservation(Long userId, Long stallId) {
        ReservationStall reservationStall = reservationStallRepository.findByUserIdAndStallId(userId, stallId)
                .orElseThrow(() -> new RuntimeException("Reservation not found for this stall"));

        Stall stall = reservationStall.getStall();
        if (stall.isReserved()) {
            stall.setReserved(false);
            stallRepository.save(stall);
        }

        reservationStallRepository.delete(reservationStall);
    }
}