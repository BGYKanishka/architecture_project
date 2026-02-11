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

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationStallRepository reservationStallRepository;
    private final StallRepository stallRepository;
    private final UserRepository userRepository;

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

        try {
            String qrImageBase64 = generateQRCodeImage(qrToken);
            // TODO: Call EmailService here using qrImageBase64

            return "Reservation Successful! QR Token: " + qrToken;
        } catch (Exception e) {
            throw new RuntimeException("Error generating QR code", e);
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