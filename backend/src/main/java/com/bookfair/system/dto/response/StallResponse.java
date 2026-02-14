
package com.bookfair.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StallResponse {
    private Long id;
    private String stallCode;
    private String size; // "Small", "Medium"
    private Double price;
    private boolean isReserved;
}


