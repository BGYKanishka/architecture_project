package com.bookfair.system.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class ReservationRequest {
    @NotEmpty(message = "You must select at least one stall")
    @Size(max = 3, message = "You cannot reserve more than 3 stalls at once")
    private List<Long> stallIds;
}