package com.example.colonyManagement.service;

import com.example.colonyManagement.entity.Colony;
import com.example.colonyManagement.entity.Building;
import com.example.colonyManagement.entity.Asset;
import com.example.colonyManagement.repository.ColonyRepository;
import com.example.colonyManagement.repository.BuildingRepository;
import com.example.colonyManagement.repository.AssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ColonyService {

    private final ColonyRepository colonyRepository;
    private final BuildingRepository buildingRepository;
    private final AssetRepository assetRepository;

    public ColonyService(ColonyRepository colonyRepository,
                         BuildingRepository buildingRepository,
                         AssetRepository assetRepository) {
        this.colonyRepository = colonyRepository;
        this.buildingRepository = buildingRepository;
        this.assetRepository = assetRepository;
    }

    @Transactional
    public Colony createColony(Colony colony) {
        return colonyRepository.save(colony);
    }

    public List<Colony> getAllColonies() {
        return colonyRepository.findAll();
    }

    public Optional<Colony> getColonyById(Long id) {
        return colonyRepository.findById(id);
    }

    @Transactional
    public Optional<Colony> updateColony(Long id, Colony colonyDetails) {
        return colonyRepository.findById(id).map(colony -> {
            colony.setName(colonyDetails.getName());
            colony.setLocation(colonyDetails.getLocation());
            colony.setDescription(colonyDetails.getDescription());
            return colonyRepository.save(colony);
        });
    }

    @Transactional
    public void deleteColony(Long id) {
        colonyRepository.findById(id).ifPresent(colony -> {
            // Unlink buildings and assets before deletion if needed, or allow cascade
            for (Building building : colony.getBuildings()) {
                building.setColony(null);
                buildingRepository.save(building);
            }
            for (Asset asset : colony.getAssets()) {
                asset.setColony(null);
                assetRepository.save(asset);
            }
            colonyRepository.delete(colony);
        });
    }
}
