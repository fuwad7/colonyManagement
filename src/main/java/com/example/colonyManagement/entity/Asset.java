package com.example.colonyManagement.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "assets")
@Data
public class Asset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING)
    private AssetType type;

    @ManyToOne
    @JoinColumn(name = "colony_id")
    @JsonIgnoreProperties({"buildings", "assets"})
    private Colony colony;

    public enum AssetType {
        FIELD, SCHOOL, COLLEGE, COMMUNITY_BUILDING
    }
}
