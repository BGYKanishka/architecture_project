package com.bookfair.system.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Rich DTO returned by GET /api/admin/stalls/availability.
 * Includes vendor information when the stall is reserved.
 */
@Data
@Builder
public class StallAvailabilityResponse {

    // ── Stall fields ──────────────────────────────────────────
    private Long id;
    private String stallCode;
    private String floorName;
    private Long floorId;
    private String size;
    private Double price;
    private boolean reserved;
    private boolean disabled;

    /** Computed display status: AVAILABLE | RESERVED | DISABLED */
    private String statusLabel;

    // ── Vendor fields (non-null only when reserved = true) ────
    private Long reservationId;
    private LocalDateTime reservationDate;
    private String reservationStatus;

    private Long vendorId;
    private String vendorName;
    private String vendorEmail;
    private String vendorContact;
    private String vendorBusiness;
    private List<String> vendorGenres;
}
