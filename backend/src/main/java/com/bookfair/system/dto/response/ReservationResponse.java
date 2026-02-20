package com.bookfair.system.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReservationResponse {
    private String reservationCode;
    private String qrCodeImage;
    private String message;
    private Long id;
    private String stallCode;
    private String size;
    private Double price;
    private String floorName;
    private String status;
}