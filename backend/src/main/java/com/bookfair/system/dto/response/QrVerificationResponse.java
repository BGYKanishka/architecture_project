package com.bookfair.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrVerificationResponse {
    private boolean accessGranted;
    private String message;
    private UserDetails user;
    private ReservationDetails reservation;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDetails {
        private Long id;
        private String name;
        private String email;
        private String contactNumber;
        private String businessName;
        private String role;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationDetails {
        private Long id;
        private String status;
        private String reservationDate;
        private List<StallDetail> stalls;
        private PaymentDetail payment;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StallDetail {
        private Long id;
        private String stallCode;
        private String size;
        private String floorName;
        private Double price;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentDetail {
        private Double amount;
        private String paymentStatus;
        private String paymentMethod;
    }
}
