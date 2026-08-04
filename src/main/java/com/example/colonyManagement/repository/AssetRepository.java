package com.example.colonyManagement.repository;

import com.example.colonyManagement.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface AssetRepository extends JpaRepository<Asset, Long>{
    List<Asset> findByType(Asset.AssetType type);
}
