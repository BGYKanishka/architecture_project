package com.bookfair.system.dto.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationEmailMessage {
    private String toEmail;
    private String userName;
    private String mobileNumber;
    private String paymentStatus;
    private String qrCodeBase64;
    private String stallDetails;
}
