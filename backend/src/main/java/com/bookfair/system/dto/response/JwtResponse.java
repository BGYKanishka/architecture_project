package com.bookfair.system.dto.response;
import lombok.Data;
import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String name;
    private String role;
    private List<String> roles;

    public JwtResponse(String accessToken, Long id, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.roles = roles;
        this.role = (roles != null && !roles.isEmpty()) ? roles.get(0).replace("ROLE_", "") : null;
    }

    public JwtResponse(String accessToken, Long id, String email, String name, String role, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.roles = roles;
    }
}