package com.bookfair.system.service;

import com.bookfair.system.dto.request.ReservationRequest;
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
                            .build()
            );

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
                    stallCodes
            );

            return new ReservationResponse(qrToken, qrImageBase64, "Booking Successful!");

        } catch (Exception e) {
            System.err.println("QR/Email Error: " + e.getMessage());
            return new ReservationResponse(qrToken, null, "Booking Success (Email Failed)");
        }
    }

    private String generateQRCodeImage(String text) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 250, 250);
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return Base64.getEncoder().encodeToString(pngOutputStream.toByteArray());
    }
}