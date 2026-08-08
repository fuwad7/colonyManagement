package com.example.colonyManagement.controller;

import com.example.colonyManagement.entity.Building;
import com.example.colonyManagement.service.BuildingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/buildings")
public class BuildingController {

    private final BuildingService buildingService;

    public BuildingController(BuildingService buildingService) {
        this.buildingService = buildingService;
    }
    @PostMapping
    public ResponseEntity<Building>createBuilding(@RequestBody Building building){
        Building savedBuildings = buildingService.createBuilding(building);
        return new ResponseEntity<>(savedBuildings, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Building>> getAllBuildings() {
        List<Building> buildings = buildingService.getAllBuildings();
        return ResponseEntity.ok(buildings);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Building>getBuildingsById(@PathVariable Long id){
        return buildingService.getBuildingsById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Building>updateBuilding(@PathVariable Long id, @RequestBody Building buildingDetails){
        return buildingService.updateBuilding(id, buildingDetails).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>deleteBuilding(@PathVariable Long id){
        buildingService.deleteBuilding(id);
        return ResponseEntity.noContent().build();
    }

}