package com.example.colonyManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flats")
@Data
public class Flat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer floorNumber;
    private String flatName;

    @ManyToOne
    @JoinColumn(name = "building_id")
    @JsonIgnoreProperties("flats")
    private Building building;
}
