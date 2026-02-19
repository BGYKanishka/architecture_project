package com.bookfair.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeStallDetailsDto {
    private Long stallId;
    private String stallCode;
    private String stallType;
    private String stallSize;
    private Double price;
    private String floorName;
    private boolean reserved;

    // Reservation Details
    private String vendorName;
    private String vendorEmail;
    private String vendorContact;
    private String businessName;

    // QR Code Data
    private String qrCodeData;

    // Payment Details
    private String paymentStatus; // PENDING, PAID, FAILED
    private Double paymentAmount;
    private LocalDateTime paymentDate;
    private String paymentMethod;
}
