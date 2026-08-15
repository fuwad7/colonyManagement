package com.example.colonyManagement.entity;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "buildings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer floorCount;

    @Column(nullable = false)
    private Integer unitsPerFloor;

    @ManyToOne
    @JoinColumn(name = "colony_id")
    @JsonIgnoreProperties({"buildings", "assets"})
    private Colony colony;

    @OneToMany(
            mappedBy = "building",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Flat> flats = new ArrayList<>();
}