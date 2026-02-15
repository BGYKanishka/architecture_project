package com.bookfair.system.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stalls", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"floor_id", "stall_code"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id", nullable = false)
    private Floor floor;

    @Column(name = "stall_code", nullable = false, length = 10)
    private String stallCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stall_type_id", nullable = false)
    private StallType stallType;


    public String getSize() {
        return stallType != null ? stallType.getSize() : "UNKNOWN";
    }

    public Double getPrice() {
        return stallType != null ? stallType.getPrice() : 0.0;
    }
}