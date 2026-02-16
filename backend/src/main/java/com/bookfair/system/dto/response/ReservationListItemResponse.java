package com.bookfair.system.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class ReservationListItemResponse {
    private Long reservationId;
    private String vendorUsername;
    private LocalDateTime createdAt;
    private String qrCodeValue;
    private List<String> stallCodes;

    public ReservationListItemResponse(Long reservationId, String vendorUsername,
            LocalDateTime createdAt, String qrCodeValue,
            List<String> stallCodes) {
        this.reservationId = reservationId;
        this.vendorUsername = vendorUsername;
        this.createdAt = createdAt;
        this.qrCodeValue = qrCodeValue;
        this.stallCodes = stallCodes;
    }

    public Long getReservationId() {
        return reservationId;
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