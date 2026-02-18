package com.bookfair.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminReservationResponse {
    private Long id;
    private String userEmail;
    private String userName;
    private LocalDateTime reservationDate;
    private String qrCodeToken;
    private String status;
}
