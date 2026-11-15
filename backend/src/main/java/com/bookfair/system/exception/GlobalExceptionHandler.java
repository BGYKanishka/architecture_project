package com.bookfair.system.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
  private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    StringBuilder summary = new StringBuilder();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((org.springframework.validation.FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
      if (errorMessage != null && !errorMessage.isBlank()) {
        if (summary.length() > 0) {
          summary.append(", ");
        }
        summary.append(errorMessage);
      }
    });
    if (summary.length() > 0) {
      errors.put("message", summary.toString());
    }
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("error", "BAD_REQUEST");
    error.put("message", ex.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<Map<String, String>> handleIllegalStateException(IllegalStateException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("error", "CONFLICT");
    error.put("message", ex.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("error", ex.getStatusCode().toString());
    error.put("message", ex.getReason() == null ? "Request failed." : ex.getReason());
    return ResponseEntity.status(ex.getStatusCode()).body(error);
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
      logger.debug("Client disconnected while the server was writing a response.");
      return null; // Return null to stop processing response
    }

    // For real errors, print stack trace
    logger.error("Failed to write API response", ex);
    Map<String, String> error = new HashMap<>();
    error.put("error", "INTERNAL_SERVER_ERROR");
    error.put("message", "An unexpected error occurred.");
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
    logger.error("Unhandled API exception", ex);
    Map<String, String> error = new HashMap<>();
    error.put("error", "INTERNAL_SERVER_ERROR");
    error.put("message", "An unexpected error occurred.");
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }
}
