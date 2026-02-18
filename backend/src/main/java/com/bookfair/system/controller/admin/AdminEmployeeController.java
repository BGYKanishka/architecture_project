package com.bookfair.system.controller.admin;

import com.bookfair.system.entity.Employee;
import com.bookfair.system.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/employees")
@RequiredArgsConstructor
public class AdminEmployeeController {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {
        // Check unique email
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already in use."));
        }
        // Hash password before saving
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        return ResponseEntity.ok(employeeRepository.save(employee));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody Employee updated) {
        return employeeRepository.findById(id).map(emp -> {
            // Check unique email (exclude current employee)
            if (!emp.getEmail().equals(updated.getEmail())
                    && employeeRepository.existsByEmail(updated.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email already in use."));
            }
            emp.setName(updated.getName());
            emp.setEmployeeCode(updated.getEmployeeCode());
            emp.setDesignation(updated.getDesignation());
            emp.setEmail(updated.getEmail());
            // Only re-hash if a new password is provided
            if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
                emp.setPassword(passwordEncoder.encode(updated.getPassword()));
            }
            return ResponseEntity.ok(employeeRepository.save(emp));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        employeeRepository.deleteById(id);
        return ResponseEntity.ok("Employee deleted successfully");
    }
}
