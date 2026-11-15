package com.bookfair.system.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class ReservationRequest {

    @NotEmpty(message = "Select at least one stall.")
    @Size(max = 3, message = "You can reserve at most 3 stalls at a time.")
    private List<@NotNull @Positive Long> stallIds;

    private String paymentMethod = "CASH_ON_DATE";
}
