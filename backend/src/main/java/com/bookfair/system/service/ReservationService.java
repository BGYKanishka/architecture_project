package com.bookfair.system.service;

import com.bookfair.system.dto.request.ReservationRequest;
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
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationStallRepository reservationStallRepository;
    private final StallRepository stallRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public String createReservation(Long userId, ReservationRequest request) {


        long currentBookings = reservationStallRepository.countStallsByUserId(userId);
        if (currentBookings + request.getStallIds().size() > 3) {
            throw new RuntimeException("Limit Exceeded: You can only reserve up to 3 stalls per business.");
        }


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        String qrToken = UUID.randomUUID().toString();
        Reservation reservation = Reservation.builder()
                .user(user)
                .status("CONFIRMED")
                .qrCodeToken(qrToken)
                .build();

        reservationRepository.save(reservation);

        for (Long stallId : request.getStallIds()) {
            Stall stall = stallRepository.findByIdWithLock(stallId)
                    .orElseThrow(() -> new RuntimeException("Stall ID " + stallId + " not found"));

            if (reservationStallRepository.isStallReserved(stallId)) {
                throw new RuntimeException("Stall " + stall.getStallCode() + " is already reserved!");
            }

            ReservationStall link = ReservationStall.builder()
                    .reservation(reservation)
                    .stall(stall)
                    .build();

            reservationStallRepository.save(link);
        }

        // 5. Generate QR Code & Send Email
        try {
            String qrImageBase64 = generateQRCodeImage(qrToken);

            // Construct a readable list of stall codes (e.g., "A1, A2")
            String stallCodes = request.getStallIds().stream()
                    .map(id -> "Stall ID: " + id) // Ideally, fetch the Stall Code strings, but IDs work for now
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("Stalls");

            // Fire and forget (Async)
            emailService.sendReservationEmail(
                    user.getEmail(),
                    user.getName(),
                    qrImageBase64,
                    stallCodes
            );

            return "Reservation Successful! QR Token: " + qrToken;
        } catch (Exception e) {
            // If email fails, we log it but don't fail the transaction
            System.err.println("Error generating/sending QR: " + e.getMessage());
            return "Reservation Successful (Email failed). Token: " + qrToken;
        }
    }

    private String generateQRCodeImage(String text) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 250, 250);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();

        return Base64.getEncoder().encodeToString(pngData);
    }
}