package com.example.colonyManagement.entity;

import jakarta.persistence.*;
import lombok.*;
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

    public enum AssetType {
        FIELD, SCHOOL, COLLEGE, COMMUNITY_BUILDING
    }
}
