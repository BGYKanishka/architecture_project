package com.bookfair.system.repository;

import com.bookfair.system.entity.Stall;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StallRepository extends JpaRepository<Stall, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Stall s WHERE s.id = :id")
    Optional<Stall> findByIdWithLock(@Param("id") Long id);

    @Query("SELECT s FROM Stall s JOIN FETCH s.floor")
    List<Stall> findAllWithFloors();

    @Query("SELECT s FROM Stall s JOIN FETCH s.floor WHERE s.floor.id = :floorId")
    List<Stall> findByFloorId(@Param("floorId") Long floorId);
}