package com.bookfair.system.controller.vendor_and_publishers;

import com.bookfair.system.dto.response.StallResponse;
import com.bookfair.system.entity.Stall;
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

    @GetMapping
    public ResponseEntity<List<StallResponse>> getAllStalls() {
        List<Stall> stalls = stallRepository.findAll();

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
