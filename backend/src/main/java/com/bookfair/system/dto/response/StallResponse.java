package com.bookfair.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StallResponse {
    private Long id;
    private String stallCode;
    private String size;
    private Double price;
    private boolean reserved;
    private String floorName;
}
