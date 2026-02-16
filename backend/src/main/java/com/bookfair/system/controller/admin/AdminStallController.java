package com.bookfair.system.controller.admin;

import com.bookfair.system.entity.Stall;
import com.bookfair.system.service.StallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stalls")
@RequiredArgsConstructor
public class AdminStallController {

    private final StallService stallService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<Stall>> getAllStalls() {
        return ResponseEntity.ok(stallService.getAllStalls());
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