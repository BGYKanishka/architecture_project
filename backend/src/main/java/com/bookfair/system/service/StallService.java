package com.bookfair.system.service;

import com.bookfair.system.entity.Stall;
import com.bookfair.system.repository.StallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StallService {

    private final StallRepository stallRepository;

    public List<Stall> getAllStalls() {
        return stallRepository.findAll();
    }

    public Optional<Stall> getStallById(Long id) {
        return stallRepository.findById(id);
    }

    @Transactional
    public Stall createStall(Stall stall) {
        return stallRepository.save(stall);
    }

    @Transactional
    public Stall updateStall(Long id, Stall stallDetails) {
        Stall stall = stallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stall not found with id: " + id));

        stall.setStallCode(stallDetails.getStallCode());
        stall.setStallType(stallDetails.getStallType());
        stall.setFloor(stallDetails.getFloor());

        return stallRepository.save(stall);
    }

    @Transactional
    public void deleteStall(Long id) {
        Stall stall = stallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stall not found with id: " + id));
        stallRepository.delete(stall);
    }
}
