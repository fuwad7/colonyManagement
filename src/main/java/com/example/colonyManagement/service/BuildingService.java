package com.example.colonyManagement.service;

import com.example.colonyManagement.repository.BuildingRepository;
import com.example.colonyManagement.entity.Building;
import org.hibernate.dialect.unique.CreateTableUniqueDelegate;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


public class BuildingService {
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
    public List<Building>updateBuilding(Long id, Building updatedBuilding){
return buildingRepository.findById(id)
hhgh
    }
        @Transactional
        public void deleteBuilding(Long id) {
            buildingRepository.deleteById(id);
        }

    }
