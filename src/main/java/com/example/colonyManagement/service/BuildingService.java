package com.example.colonyManagement.service;

import com.example.colonyManagement.repository.BuildingRepository;
import com.example.colonyManagement.entity.Building;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.*;
import java.util.List;
import java.util.Optional;

@Service
public class BuildingService {
    @Autowired
    private BuildingRepository buildingRepository;
    public Building createBuilding(Building building) {
        return buildingRepository.save(building);
    }
    public List<Building>getAllBuildings(){
        return buildingRepository.findAll();
    }
    public Optional<Building>getBuildingsById(Long id) {
        return buildingRepository.findById(id);
    }
    @Transactional
    public Optional<Building> updateBuilding(Long id, Building buildingDetails){
return buildingRepository.findById(id).map(building -> {
    building.setName(buildingDetails.getName());
    building.setFloorCount(buildingDetails.getFloorCount());
    building.setUnitsPerFloor(buildingDetails.getUnitsPerFloor());
    return buildingRepository.save(building);
});
    }
        @Transactional
        public void deleteBuilding(Long id) {
            buildingRepository.deleteById(id);
        }
    }
