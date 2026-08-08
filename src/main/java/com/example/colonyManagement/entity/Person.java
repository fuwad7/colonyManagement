package com.example.colonyManagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "persons")
@Data
<<<<<<< HEAD
@NoArgsConstructor
@AllArgsConstructor
@Builder
=======

>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String phone;
    private String personId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;
<<<<<<< HEAD
=======

    public Person orElse(Object o) {
        return null;
    }
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
}