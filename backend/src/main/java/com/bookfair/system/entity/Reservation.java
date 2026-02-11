package com.bookfair.system.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "reservation_date", updatable = false)
    private LocalDateTime reservationDate;

    @Column(name = "qr_code_token", unique = true, nullable = false)
    private String qrCodeToken;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING"; // Pending, Confirmed, Canceled
}