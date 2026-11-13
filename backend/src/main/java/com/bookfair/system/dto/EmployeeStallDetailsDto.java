package com.bookfair.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private boolean disabled;

    // Reservation Details
    private String vendorName;
    private String businessName;
}
