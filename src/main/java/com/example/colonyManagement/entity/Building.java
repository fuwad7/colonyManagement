package com.example.colonyManagement.entity;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
=======
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "buildings")
@Data
<<<<<<< HEAD
=======

>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
public class Building {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer floorCount;
    private Integer unitsPerFloor;

    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL, orphanRemoval = true)
<<<<<<< HEAD
    @JsonIgnoreProperties("building")
=======
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
    private List<Flat> flats;
}