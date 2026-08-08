package com.example.colonyManagement.service;

import com.example.colonyManagement.entity.Building;
import com.example.colonyManagement.entity.Flat;
import com.example.colonyManagement.repository.BuildingRepository;
import com.example.colonyManagement.repository.FlatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BuildingService {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private FlatRepository flatRepository;

    @Transactional
    public Building createBuilding(Building building) {
        Building savedBuilding = buildingRepository.save(building);

        int floors = building.getFloorCount() != null ? building.getFloorCount() : 0;
        int unitsPerFloor = building.getUnitsPerFloor() != null ? building.getUnitsPerFloor() : 0;

        List<Flat> flats = new ArrayList<>();
        for (int floor = 1; floor <= floors; floor++) {
            for (int unit = 1; unit <= unitsPerFloor; unit++) {
                Flat flat = new Flat();
                flat.setFloorNumber(floor);
                String flatName = String.format("%d%02d", floor, unit);
                flat.setFlatName("Flat " + flatName);
                flat.setBuilding(savedBuilding);
                flats.add(flat);
            }
        }

        if (!flats.isEmpty()) {
            List<Flat> savedFlats = flatRepository.saveAll(flats);
            savedBuilding.setFlats(savedFlats);
        }

        return savedBuilding;
    }

    public List<Building> getAllBuildings() {
        return buildingRepository.findAll();
    }

    public Optional<Building> getBuildingsById(Long id) {
        return buildingRepository.findById(id);
    }

    @Transactional
    public Optional<Building> updateBuilding(Long id, Building buildingDetails) {
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

