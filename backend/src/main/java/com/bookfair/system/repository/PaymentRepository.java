package com.bookfair.system.repository;

import com.bookfair.system.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    java.util.Optional<Payment> findByReservationId(Long reservationId);
}