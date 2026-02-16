package com.bookfair.system.controller;

import com.bookfair.system.entity.Employee;
import com.bookfair.system.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin("*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/verify-qr")
    public ResponseEntity<?> verifyEmployee(@RequestBody String qrCode) {
        return employeeRepository.findByEmployeeCode(qrCode.replace("\"", ""))
                .map(employee -> ResponseEntity.ok(employee))
                .orElse(ResponseEntity.notFound().build());
    }
}