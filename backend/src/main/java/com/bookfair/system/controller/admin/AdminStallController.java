package com.bookfair.system.controller.admin;

import com.bookfair.system.dto.response.StallAvailabilityResponse;
import com.bookfair.system.dto.response.StallResponse;
import com.bookfair.system.entity.Stall;
import com.bookfair.system.service.StallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/stalls")
@RequiredArgsConstructor
public class AdminStallController {

    private final StallService stallService;

    /**
     * GET /api/admin/stalls/availability
     * Returns all stalls with status labels and vendor info for reserved ones.
     */
    @GetMapping("/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<StallAvailabilityResponse>> getStallAvailability() {
        return ResponseEntity.ok(stallService.getStallAvailability());
    }

    /**
     * PATCH /api/admin/stalls/{id}/toggle-disabled
     * Enables or disables a stall (cannot disable a currently reserved stall).
     */
    @PatchMapping("/{id}/toggle-disabled")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleDisabled(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(stallService.toggleDisabled(id));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "STALL_IS_RESERVED", "message", e.getMessage()));
        }
    }

    // ── Legacy endpoints (kept for backward compatibility) ─────

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<StallResponse>> getAllStalls() {
        List<Stall> stalls = stallService.getAllStalls();
        List<StallResponse> response = stalls.stream().map(stall -> new StallResponse(
                stall.getId(),
                stall.getStallCode(),
                stall.getSize(),
                stall.getPrice(),
                stall.isReserved(),
                stall.getFloor().getFloorName())).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Stall> createStall(@RequestBody Stall stall) {
        return ResponseEntity.ok(stallService.createStall(stall));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Stall> updateStall(@PathVariable Long id, @RequestBody Stall stall) {
        return ResponseEntity.ok(stallService.updateStall(id, stall));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStall(@PathVariable Long id) {
        stallService.deleteStall(id);
        return ResponseEntity.ok("Stall deleted successfully");
    }
}