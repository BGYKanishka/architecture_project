package com.bookfair.system.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class ReservationRequest {

    @NotEmpty
    @Size(max = 3, message = "You can reserve at most 3 stalls at a time")
    private List<@NotNull @Positive Long> stallIds;

    @NotBlank
    @Pattern(regexp = "CASH_ON_DATE", message = "Unsupported payment method")
    private String paymentMethod;
}
