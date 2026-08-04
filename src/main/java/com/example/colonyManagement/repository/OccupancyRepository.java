package com.example.colonyManagement.repository;

import com.example.colonyManagement.entity.Occupancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface OccupancyRepository extends JpaRepository<Occupancy, Integer>{
}
