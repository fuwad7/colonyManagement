package com.example.colonyManagement.repository;

import com.example.colonyManagement.entity.Flat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface FlatRepository extends JpaRepository<Flat, Long>{
}
