package com.example.colonyManagement.controller;

import com.example.colonyManagement.entity.Occupancy;
import com.example.colonyManagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardApiController {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private FlatRepository flatRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private OccupancyRepository occupancyRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        long buildingCount = buildingRepository.count();
        long flatCount = flatRepository.count();
        long personCount = personRepository.count();
        long assetCount = assetRepository.count();
        long userCount = userRepository.count();

        long ownerCount = occupancyRepository.findAll().stream()
                .filter(o -> o.getOccupancyType() == Occupancy.OccupancyType.OWNER)
                .count();

        long tenantCount = occupancyRepository.findAll().stream()
                .filter(o -> o.getOccupancyType() == Occupancy.OccupancyType.TENANT)
                .count();

        long subTenantCount = occupancyRepository.findAll().stream()
                .filter(o -> o.getOccupancyType() == Occupancy.OccupancyType.SUB_TENANT)
                .count();

        stats.put("buildingCount", buildingCount);
        stats.put("flatCount", flatCount);
        stats.put("residentCount", personCount);
        stats.put("ownerCount", ownerCount);
        stats.put("tenantCount", tenantCount);
        stats.put("subTenantCount", subTenantCount);
        stats.put("assetCount", assetCount);
        stats.put("userCount", userCount);

        return ResponseEntity.ok(stats);
    }
}
