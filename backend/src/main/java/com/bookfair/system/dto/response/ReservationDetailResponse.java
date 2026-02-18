package com.bookfair.system.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class ReservationDetailResponse {
    private Long reservationId;
    private Long vendorId;
    private String vendorUsername;
    private LocalDateTime createdAt;
    private String qrCodeValue;
    private List<String> stallCodes;

    public ReservationDetailResponse(Long reservationId, Long vendorId, String vendorUsername,
            LocalDateTime createdAt, String qrCodeValue,
            List<String> stallCodes) {
        this.reservationId = reservationId;
        this.vendorId = vendorId;
        this.vendorUsername = vendorUsername;
        this.createdAt = createdAt;
        this.qrCodeValue = qrCodeValue;
        this.stallCodes = stallCodes;
    }

    public Long getReservationId() {
        return reservationId;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public String getVendorUsername() {
        return vendorUsername;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getQrCodeValue() {
        return qrCodeValue;
    }

    public List<String> getStallCodes() {
        return stallCodes;
    }
}