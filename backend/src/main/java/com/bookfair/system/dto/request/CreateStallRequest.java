package com.bookfair.system.dto.request;

public class CreateStallRequest {
    private String code; // A1, B1 etc
    private String size; // SMALL / MEDIUM / LARGE

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
}