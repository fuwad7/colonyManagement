package com.example.colonyManagement.repository;

import com.example.colonyManagement.entity.Occupancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface OccupancyRepository extends JpaRepository<Occupancy, Integer>{
    List<Occupancy> findByPersonId(long person_id);

    List<Occupancy> findByOccupancyType(Occupancy.OccupancyType occupancyType);
}
