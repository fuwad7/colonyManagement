package com.example.colonyManagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
<<<<<<< HEAD
@NoArgsConstructor
@AllArgsConstructor
@Builder
=======
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
<<<<<<< HEAD
    private String username;

    @Column(unique = true, nullable = false)
=======
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
    private String email;

    @Column(nullable = false)
    private String password;

    private String role;
<<<<<<< HEAD

    @Builder.Default
    private boolean enabled = true;
=======
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
}