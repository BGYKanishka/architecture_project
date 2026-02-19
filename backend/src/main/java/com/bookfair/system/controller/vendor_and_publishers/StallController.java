package com.bookfair.system.controller.vendor_and_publishers;

import com.bookfair.system.dto.response.StallResponse;
import com.bookfair.system.entity.Floor;
import com.bookfair.system.entity.Stall;
import com.bookfair.system.repository.FloorRepository;
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
    private final FloorRepository floorRepository;

    @GetMapping("/halls")
    public ResponseEntity<List<Floor>> getAllHalls() {
        return ResponseEntity.ok(floorRepository.findAll());
    }

    @GetMapping
    public ResponseEntity<List<StallResponse>> getAllStalls(@RequestParam(required = false) Long floorId) {
        List<Stall> stalls;

        if (floorId != null) {
            stalls = stallRepository.findByFloorId(floorId);
        } else {
            stalls = stallRepository.findAllWithFloors();
        }

        List<StallResponse> response = stalls.stream().map(stall -> {
            return new StallResponse(
                    stall.getId(),
                    stall.getStallCode(),
                    stall.getSize(),
                    stall.getPrice(),
                    stall.isReserved(),
                    stall.getFloor().getFloorName());
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}