package com.example.colonyManagement.repository;

import com.example.colonyManagement.entity.Colony;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColonyRepository extends JpaRepository<Colony, Long> {
}
