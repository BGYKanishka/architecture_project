package com.bookfair.system.repository;

import com.bookfair.system.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    /*
    @Query("SELECT COUNT(rs) FROM Reservation r JOIN r.reservationStalls rs " +
           "WHERE r.user.id = :userId AND r.status != 'CANCELLED'")
    long countStallsByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(rs) FROM Reservation r JOIN r.reservationStalls rs " +
           "WHERE rs.stall.id IN :stallIds AND r.status != 'CANCELLED'")
    long countConflictingReservations(@Param("stallIds") List<Long> stallIds);
    
    List<Reservation> findByStatus(String status);
    */
}
