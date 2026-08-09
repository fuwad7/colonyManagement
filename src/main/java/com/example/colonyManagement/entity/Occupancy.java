package com.example.colonyManagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "occupancies")
@Data
public class Occupancy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private OccupancyType occupancyType;

    @ManyToOne
    @JoinColumn(name = "flat_id", nullable = false)
    private Flat flat;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "rented_from_id")
    private Person rentedFrom;

    public enum OccupancyType {
        OWNER, TENANT, SUB_TENANT
    }
}