package com.bookfair.system.repository;

import com.bookfair.system.entity.ReservationStall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ReservationStallRepository extends JpaRepository<ReservationStall, Long> {

        // Check reservation
        @Query("SELECT COUNT(rs) > 0 FROM ReservationStall rs " +
                        "WHERE rs.stall.id = :stallId AND rs.reservation.status = 'CONFIRMED'")
        boolean isStallReserved(@Param("stallId") Long stallId);

        @Query("SELECT COUNT(rs) FROM ReservationStall rs " +
                        "WHERE rs.reservation.user.id = :userId AND rs.reservation.status != 'CANCELLED'")
        long countStallsByUserId(@Param("userId") Long userId);

        @Query("SELECT rs FROM ReservationStall rs " +
                        "JOIN FETCH rs.reservation r " +
                        "JOIN FETCH r.user u " +
                        "WHERE rs.stall.id = :stallId AND r.status = 'CONFIRMED'")
        Optional<ReservationStall> findActiveByStallId(@Param("stallId") Long stallId);

        // Find stalls by user ID (From MAIN branch)
        @Query("SELECT rs FROM ReservationStall rs " +
                        "JOIN FETCH rs.reservation r " +
                        "JOIN FETCH rs.stall s " +
                        "JOIN FETCH s.floor " +
                        "WHERE r.user.id = :userId AND r.status = 'CONFIRMED'  AND r.qrCodeToken NOT LIKE '%-C-%'")
        List<ReservationStall> findAllByReservationUserId(@Param("userId") Long userId);

        // Find specific ACTIVE stall by user and stall ID
        @Query("SELECT rs FROM ReservationStall rs WHERE rs.reservation.user.id = :userId AND rs.stall.id = :stallId AND rs.reservation.status != 'CANCELLED'")
        Optional<ReservationStall> findActiveByUserIdAndStallId(@Param("userId") Long userId,
                        @Param("stallId") Long stallId);

        @Query("SELECT COUNT(rs) FROM ReservationStall rs WHERE rs.reservation.id = :reservationId")
        long countByReservationId(@Param("reservationId") Long reservationId);

        @Query("SELECT rs FROM ReservationStall rs JOIN FETCH rs.stall JOIN FETCH rs.reservation")
        List<ReservationStall> findAllWithStallsAndReservations();
}