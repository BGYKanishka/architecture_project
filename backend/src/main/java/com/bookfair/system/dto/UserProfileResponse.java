package com.bookfair.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
  private String name;
  private String email;
  private String contactNumber;
  private String businessName;
  private String role;
}
