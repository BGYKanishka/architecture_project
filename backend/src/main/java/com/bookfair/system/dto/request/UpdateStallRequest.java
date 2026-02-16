package com.bookfair.system.dto.request;

public class UpdateStallRequest {
    private String code; // optional
    private String size; // optional
    private String status; // AVAILABLE / RESERVED (optional)

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}