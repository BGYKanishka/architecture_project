package com.bookfair.system.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reservation_stalls", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"reservation_id", "stall_id"})
})
@Data  // Using Getter/Setter instead of @Data to avoid recursion in toString
//@Getter
//@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationStall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stall_id", nullable = false)
    private Stall stall;
/*
public ReservationStall(Reservation reservation, Stall stall) {
        this.reservation = reservation;
        this.stall = stall;
    }
*/
}
