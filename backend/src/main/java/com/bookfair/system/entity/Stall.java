package com.bookfair.system.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stalls", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "floor_id", "stall_code" })
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "floor_id", nullable = false)
    private Floor floor;

    @Column(name = "stall_code", nullable = false, length = 10)
    private String stallCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stall_type_id", nullable = false)
    private StallType stallType;

    @Builder.Default
    @Column(columnDefinition = "boolean default false")
    private boolean reserved = false;

    /** Admin can disable a stall to prevent new reservations. */
    @Builder.Default
    @Column(columnDefinition = "boolean default false")
    private boolean disabled = false;

    public String getSize() {
        return stallType != null ? stallType.getSize() : "UNKNOWN";
    }

    public Double getPrice() {
        return stallType != null ? stallType.getPrice() : 0.0;
    }
}
