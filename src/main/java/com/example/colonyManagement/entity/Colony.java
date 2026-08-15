package com.example.colonyManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "colonies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Colony {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String location;

    private String description;

    @OneToMany(
            mappedBy = "colony",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE}
    )
    @JsonIgnoreProperties("colony")
    @Builder.Default
    private List<Building> buildings = new ArrayList<>();

    @OneToMany(
            mappedBy = "colony",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE}
    )
    @JsonIgnoreProperties("colony")
    @Builder.Default
    private List<Asset> assets = new ArrayList<>();
}
