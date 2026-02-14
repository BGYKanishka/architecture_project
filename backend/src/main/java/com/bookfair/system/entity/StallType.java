package com.bookfair.system.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stall_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StallType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String size; // SMALL, MEDIUM, LARGE

    @Column(nullable = false)
    private Double price;
}