package com.example.colonyManagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer floorNumber;

    private String flatName;

    @ManyToOne
    @JoinColumn(name = "building_id")
    private Building building;
}