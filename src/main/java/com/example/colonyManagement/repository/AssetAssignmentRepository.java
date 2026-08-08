package com.example.colonyManagement.repository;

import com.example.colonyManagement.entity.AssetAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, Long >{
    List<AssetAssignment> findByPersonId(Long personId);
    List<AssetAssignment> findByAssetId(Long assetId);
}
