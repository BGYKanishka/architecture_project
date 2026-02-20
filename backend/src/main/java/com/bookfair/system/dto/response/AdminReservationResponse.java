package com.bookfair.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminReservationResponse {
    private Long id;
    private String userEmail;
    private String userName;
    private LocalDateTime reservationDate;
    private String qrCodeToken;
    private String status;
    private List<StallDetail> stalls;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StallDetail {
        private Long id;
        private String stallCode;
        private String status;
    }
}
