package com.example.colonyManagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "occupancies")
@Data

public class Occupancy {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private int id;

<<<<<<< HEAD
    @Enumerated(EnumType.STRING)
    private OccupancyType occupancyType;
=======
@Enumerated(EnumType.STRING)
    private OccupancyType OccupancyType;
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
@ManyToOne
    @JoinColumn(name = "flat_id", nullable = false)
    private Flat flat;
@ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

@ManyToOne
    @JoinColumn(name ="rented_from_id")
    private Person rentedFrom;

public enum OccupancyType {
    OWNER, TENANT, SUB_TENANT
}
}
