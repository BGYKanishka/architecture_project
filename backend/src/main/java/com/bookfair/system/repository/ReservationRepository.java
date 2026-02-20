package com.bookfair.system.repository;

import com.bookfair.system.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    long countByUserId(Long userId);

    /**
     * Eagerly fetches User via JOIN FETCH in a single SQL query.
     * Avoids LazyInitializationException when mapping to DTO outside a transaction.
     */
    @Query("SELECT r FROM Reservation r JOIN FETCH r.user")
    List<Reservation> findAllWithUser();

    @Query("SELECT r FROM Reservation r JOIN FETCH r.user WHERE r.qrCodeToken NOT LIKE '%-C-%' ORDER BY r.reservationDate DESC")
    List<Reservation> findAllBaseReservationsWithUser();

    /**
     * Eagerly fetches User for a single Reservation by id.
     * Used by updateReservationStatus to safely map to DTO.
     */
    @Query("SELECT r FROM Reservation r JOIN FETCH r.user WHERE r.id = :id")
    Optional<Reservation> findByIdWithUser(@Param("id") Long id);
}
