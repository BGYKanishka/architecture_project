
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

// package com.bookfair.system.dto.response;

// public class StallResponse {
// private Long id;
// private String code;
// private String size;
// private String status;

// public StallResponse(Long id, String code, String size, String status) {
// this.id = id;
// this.code = code;
// this.size = size;
// this.status = status;
// }

// public Long getId() { return id; }
// public String getCode() { return code; }
// public String getSize() { return size; }
// public String getStatus() { return status; }
// }