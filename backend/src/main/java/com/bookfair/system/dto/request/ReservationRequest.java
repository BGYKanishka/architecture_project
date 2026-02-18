package com.bookfair.system.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class ReservationRequest {
    @NotEmpty
    private List<Long> stallIds;
    private String paymentMethod;
    private Double totalAmount;
}