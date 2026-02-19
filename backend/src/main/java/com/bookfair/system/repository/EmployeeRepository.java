package com.bookfair.system.repository;

import com.bookfair.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Legacy repository — employee QR lookup via User entity.
 * The employeeCode is matched against the user's qrCodeToken via Reservation.
 */
public interface EmployeeRepository extends JpaRepository<User, Long> {
    // Kept for backward compatibility — finds employee user by role
    Optional<User> findFirstByRole(String role);
}