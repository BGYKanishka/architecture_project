package com.bookfair.system.controller;

import com.bookfair.system.dto.EmployeeStallDetailsDto;
import com.bookfair.system.entity.Payment;
import com.bookfair.system.entity.Reservation;
import com.bookfair.system.entity.ReservationStall;
import com.bookfair.system.entity.Stall;
import com.bookfair.system.repository.PaymentRepository;
import com.bookfair.system.repository.ReservationStallRepository;
import com.bookfair.system.repository.StallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeePanelController {

    private final StallRepository stallRepository;
    private final ReservationStallRepository reservationStallRepository;
    private final PaymentRepository paymentRepository;

    @GetMapping("/stalls")
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<EmployeeStallDetailsDto>> getAllStallsForEmployee() {
        List<Stall> allStalls = stallRepository.findAll();
        List<ReservationStall> reservedStalls = reservationStallRepository.findAll();
        List<Payment> payments = paymentRepository.findAll();

        List<EmployeeStallDetailsDto> stallDtos = allStalls.stream().map(stall -> {
            EmployeeStallDetailsDto dto = EmployeeStallDetailsDto.builder()
                    .stallId(stall.getId())
                    .stallCode(stall.getStallCode())
                    .stallType(stall.getStallType().getSize())
                    .stallSize(stall.getSize())
                    .price(stall.getPrice())
                    .floorName(stall.getFloor().getFloorName())
                    .reserved(stall.isReserved())
                    .build();

            // Find reservation details if reserved
            if (stall.isReserved()) {
                reservationStallRepository
                        .findByStall_IdAndReservation_StatusIn(stall.getId(), List.of("CONFIRMED", "PENDING"))
                        .ifPresent(rs -> {
                            Reservation reservation = rs.getReservation();
                            dto.setVendorName(reservation.getUser().getName());
                            dto.setVendorEmail(reservation.getUser().getEmail());
                            dto.setVendorContact(reservation.getUser().getContactNumber());
                            dto.setBusinessName(reservation.getUser().getBusinessName());

                            // Find payment details
                            paymentRepository.findByReservationId(reservation.getId()).ifPresent(payment -> {
                                dto.setPaymentStatus(payment.getPaymentStatus());
                                dto.setPaymentAmount(payment.getAmount());
                                dto.setPaymentDate(payment.getPaymentDate());
                                dto.setPaymentMethod(payment.getPaymentMethod());
                            });
                        });
            }

            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(stallDtos);
    }
}
