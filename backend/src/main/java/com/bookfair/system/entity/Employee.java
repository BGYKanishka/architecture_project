package com.bookfair.system.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "employees", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@Data
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "employee_code", nullable = false, unique = true)
    private String employeeCode;

    @Column(nullable = false)
    private String designation;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
}