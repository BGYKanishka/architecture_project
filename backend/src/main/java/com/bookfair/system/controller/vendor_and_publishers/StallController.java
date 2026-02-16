package com.bookfair.system.controller.vendor_and_publishers;

import com.bookfair.system.dto.response.StallResponse;
import com.bookfair.system.entity.Floor;
import com.bookfair.system.entity.Stall;
import com.bookfair.system.repository.FloorRepository;
import com.bookfair.system.repository.ReservationStallRepository;
import com.bookfair.system.repository.StallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stalls")
@RequiredArgsConstructor
public class StallController {

    private final StallRepository stallRepository;
    private final ReservationStallRepository reservationStallRepository;
    private final FloorRepository floorRepository; // <--- 1. Inject this

    // 2. NEW ENDPOINT: Get all Halls (Floors) so Frontend can make tabs
    @GetMapping("/halls")
    public ResponseEntity<List<Floor>> getAllHalls() {
        return ResponseEntity.ok(floorRepository.findAll());
    }

    // 3. UPDATED ENDPOINT: Allow filtering by floorId
    @GetMapping
    public ResponseEntity<List<StallResponse>> getAllStalls(@RequestParam(required = false) Long floorId) {

        List<Stall> stalls;

        if (floorId != null) {
            // If frontend sends ?floorId=1, get only that hall's stalls
            stalls = stallRepository.findByFloorId(floorId);
        } else {
            // Otherwise, fetch everything (fallback)
            stalls = stallRepository.findAll();
        }

        List<StallResponse> response = stalls.stream().map(stall -> {
            boolean isReserved = reservationStallRepository.isStallReserved(stall.getId());
            return new StallResponse(
                    stall.getId(),
                    stall.getStallCode(),
                    stall.getSize(),
                    stall.getPrice(),
                    isReserved
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}