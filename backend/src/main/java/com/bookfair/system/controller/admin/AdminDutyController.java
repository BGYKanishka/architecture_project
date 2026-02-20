package com.bookfair.system.controller.admin;

import com.bookfair.system.entity.Duty;
import com.bookfair.system.service.DutyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/duties")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN')")
public class AdminDutyController {

    private final DutyService dutyService;

    @GetMapping
    public ResponseEntity<List<Duty>> getAllDuties() {
        return ResponseEntity.ok(dutyService.getAllDuties());
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Duty> createDuty(@RequestBody Duty duty, @PathVariable Long userId) {
        return ResponseEntity.ok(dutyService.createDuty(duty, userId));
    }

    @PutMapping("/{id}/user/{userId}")
    public ResponseEntity<Duty> updateDuty(@PathVariable Long id, @RequestBody Duty duty, @PathVariable Long userId) {
        return ResponseEntity.ok(dutyService.updateDuty(id, duty, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDuty(@PathVariable Long id) {
        dutyService.deleteDuty(id);
        return ResponseEntity.ok(Map.of("message", "Duty deleted successfully"));
    }
}
