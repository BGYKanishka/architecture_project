package com.bookfair.system.repository;

import com.bookfair.system.entity.Reservation;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    long countByUserId(Long userId);

    @Query("SELECT r FROM Reservation r JOIN FETCH r.user WHERE r.qrCodeToken NOT LIKE '%-C-%' ORDER BY r.reservationDate DESC")
    List<Reservation> findAllBaseReservationsWithUser();

    /**
     * Eagerly fetches User for a single Reservation by id.
     * Used by updateReservationStatus to safely map to DTO.
     */
    @Query("SELECT r FROM Reservation r JOIN FETCH r.user WHERE r.id = :id")
    Optional<Reservation> findByIdWithUser(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Reservation r WHERE r.id = :id")
    Optional<Reservation> findByIdForUpdate(@Param("id") Long id);

    /**
     * Eagerly fetches User for a single Reservation by qrCodeToken.
     * Used by QR scan verification to safely map to DTO.
     */
    @Query("SELECT r FROM Reservation r JOIN FETCH r.user WHERE r.qrCodeToken = :token")
    Optional<Reservation> findByQrCodeTokenWithUser(@Param("token") String token);
}
