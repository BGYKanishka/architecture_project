package com.bookfair.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StallResponse {
    private Long id;
    private String stallCode;
    private String size;
    private Double price;
    private boolean reserved;
    private boolean disabled;
    private String floorName;

    // Extended role-based details (populated for EMPLOYEE / ADMIN, null for VENDOR / Anonymous)
    private String vendorName;
    private String businessName;

    public StallResponse(Long id, String stallCode, String size, Double price, boolean reserved, boolean disabled, String floorName) {
        this.id = id;
        this.stallCode = stallCode;
        this.size = size;
        this.price = price;
        this.reserved = reserved;
        this.disabled = disabled;
        this.floorName = floorName;
    }
}
