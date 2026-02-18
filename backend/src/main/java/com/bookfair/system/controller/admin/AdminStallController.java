package com.bookfair.system.controller.admin;

import com.bookfair.system.dto.response.StallResponse;
import com.bookfair.system.entity.Stall;
import com.bookfair.system.service.StallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/stalls")
@RequiredArgsConstructor
public class AdminStallController {

    private final StallService stallService;

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