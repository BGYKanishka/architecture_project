package com.bookfair.system.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;

@Entity
@Table(name = "reservations")
/*
@Getter 
@Setter
    */
@Data //getter setter instead of data
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
    /*

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReservationStall> reservationStalls = new ArrayList<>();

   
    public void addStall(Stall stall) {
        if (this.reservationStalls.size() >= 3) {
            throw new IllegalStateException("Project limit exceeded: You cannot reserve more than 3 stalls.");
        }
        ReservationStall link = new ReservationStall(this, stall);
        this.reservationStalls.add(link);
    }
    */
}
