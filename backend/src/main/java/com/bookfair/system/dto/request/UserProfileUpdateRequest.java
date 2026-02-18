package com.bookfair.system.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserProfileUpdateRequest {
  @Size(max = 100, message = "Name must be under 100 characters")
  private String name;

  @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Contact number must be a valid format (10-15 digits)")
  private String contactNumber;

  @Size(max = 100, message = "Business name must be under 100 characters")
  @Size(max = 100, message = "Business name must be under 100 characters")
  private String businessName;

  private java.util.List<String> genres;
}
