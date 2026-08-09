package com.example.colonyManagement.repository;

import com.example.colonyManagement.entity.Person;
import com.example.colonyManagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    boolean existsByUser(User user);
    Optional<Person> findByUser(User user);
}
