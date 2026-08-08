package com.example.colonyManagement.repository;

import com.example.colonyManagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
<<<<<<< HEAD
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}

=======

public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByEmail(String email);
}
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
