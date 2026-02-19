package com.bookfair.system.controller;

import com.bookfair.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Legacy endpoint for employee QR verification.
 * Now uses User entity (role=EMPLOYEE) instead of the removed Employee entity.
 */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin("*")
public class EmployeeController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/verify-qr")
    public ResponseEntity<?> verifyEmployee(@RequestBody String qrCode) {
        // QR code matched against user email for now (employeeCode field removed)
        String code = qrCode.replace("\"", "").trim();
        return userRepository.findByEmail(code)
                .filter(u -> "EMPLOYEE".equals(u.getRole()))
                .map(u -> ResponseEntity.ok((Object) u))
                .orElse(ResponseEntity.notFound().build());
    }
}