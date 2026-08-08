package com.example.colonyManagement.entity;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
=======
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flats")
@Data
<<<<<<< HEAD
public class Flat {
=======

public  class Flat {
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer floorNumber;
    private String flatName;

    @ManyToOne
    @JoinColumn(name = "building_id")
<<<<<<< HEAD
    @JsonIgnoreProperties("flats")
=======
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
    private Building building;
}
