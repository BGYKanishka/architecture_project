package com.bookfair.system.repository;

import com.bookfair.system.entity.ReservationStall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationStallRepository extends JpaRepository<ReservationStall, Long> {

        // Check reservation
        @Query("SELECT COUNT(rs) > 0 FROM ReservationStall rs " +
                        "WHERE rs.stall.id = :stallId AND rs.reservation.status = 'CONFIRMED'")
        boolean isStallReserved(@Param("stallId") Long stallId);

        // Count stalls
        @Query("SELECT COUNT(rs) FROM ReservationStall rs " +
                        "WHERE rs.reservation.user.id = :userId AND rs.reservation.status = 'CONFIRMED'")
        long countStallsByUserId(@Param("userId") Long userId);

        java.util.Optional<ReservationStall> findByStallId(Long stallId);

        // New method to fetch active reservations (CONFIRMED or PENDING)
        java.util.Optional<ReservationStall> findByStall_IdAndReservation_StatusIn(Long stallId,
                        java.util.List<String> statuses);
}
