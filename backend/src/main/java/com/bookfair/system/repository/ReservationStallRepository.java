package com.bookfair.system.repository;

import com.bookfair.system.entity.ReservationStall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationStallRepository extends JpaRepository<ReservationStall, Long> {

        // Check reservation
        @Query("SELECT COUNT(rs) > 0 FROM ReservationStall rs " +
                        "WHERE rs.stall.id = :stallId AND rs.reservation.status = 'CONFIRMED'")
        boolean isStallReserved(@Param("stallId") Long stallId);

        // Count stalls
        @Query("SELECT COUNT(rs) FROM ReservationStall rs " +
                        "WHERE rs.reservation.user.id = :userId AND (rs.reservation.status = 'CONFIRMED' OR rs.reservation.status = 'PENDING')")
        long countStallsByUserId(@Param("userId") Long userId);

        // Find stalls by user ID
        @Query("SELECT rs FROM ReservationStall rs " +
                        "JOIN FETCH rs.reservation r " +
                        "JOIN FETCH rs.stall s " +
                        "JOIN FETCH s.floor " +
                        "WHERE r.user.id = :userId")
        List<ReservationStall> findAllByReservationUserId(@Param("userId") Long userId);

        @Query("SELECT rs FROM ReservationStall rs WHERE rs.reservation.user.id = :userId AND rs.stall.id = :stallId")
        java.util.Optional<ReservationStall> findByUserIdAndStallId(@Param("userId") Long userId,
                        @Param("stallId") Long stallId);
}