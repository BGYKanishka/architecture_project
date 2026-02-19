package com.bookfair.system.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((org.springframework.validation.FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("error", ex.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(org.springframework.http.converter.HttpMessageNotWritableException.class)
  public ResponseEntity<Map<String, String>> handleHttpMessageNotWritableException(
      org.springframework.http.converter.HttpMessageNotWritableException ex) {
    // Check if the root cause is a client abort (socket closed)
    Throwable cause = ex.getCause();
    boolean isClientAbort = false;

    while (cause != null) {
      if (cause.getClass().getName().contains("ClientAbortException") ||
          (cause.getMessage() != null && cause.getMessage().contains("An established connection was aborted"))) {
        isClientAbort = true;
        break;
      }
      cause = cause.getCause();
    }

    if (isClientAbort) {
      // Suppress stack trace for expected client disconnects
      System.out.println("WARN: Client connection aborted during response writing. (Stack trace suppressed)");
      return null; // Return null to stop processing response
    }

    // For real errors, print stack trace
    ex.printStackTrace();
    Map<String, String> error = new HashMap<>();
    error.put("error", "Error writing JSON output: " + ex.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }

  @ExceptionHandler(com.bookfair.system.service.UserService.UserHasReservationsException.class)
  public ResponseEntity<Map<String, Object>> handleUserHasReservations(
      com.bookfair.system.service.UserService.UserHasReservationsException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("error", "USER_HAS_RESERVATIONS");
    body.put("message", "Cannot delete user because they have existing reservations. "
        + "Please reassign or cancel reservations first.");
    body.put("reservationCount", ex.getCount());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
    ex.printStackTrace(); // Log stack trace
    Map<String, String> error = new HashMap<>();
    error.put("error", "An unexpected error occurred: " + ex.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }
}
