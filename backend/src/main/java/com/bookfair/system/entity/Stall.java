package com.bookfair.system.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stalls", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"floor_id", "stall_code"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stall_code", nullable = false, length = 10)
    private String stallCode;


    @Column(name = "floor_id", nullable = false)
    private Long floorId;

    @Column(name = "stall_type_id", nullable = false)
    private Long stallTypeId;

}