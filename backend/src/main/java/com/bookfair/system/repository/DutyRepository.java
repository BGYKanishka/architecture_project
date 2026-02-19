package com.bookfair.system.repository;

import com.bookfair.system.entity.Duty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DutyRepository extends JpaRepository<Duty, Long> {
    List<Duty> findByAssignedToId(Long userId);
}
