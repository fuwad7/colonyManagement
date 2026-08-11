package com.example.colonyManagement.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import java.util.ArrayList;

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
    @JsonIgnoreProperties("flats")
    private Building building;

    @OneToMany(
            mappedBy = "flat",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Occupancy> occupancies = new ArrayList<>();
}