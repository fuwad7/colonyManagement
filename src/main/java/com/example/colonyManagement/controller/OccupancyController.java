package com.example.colonyManagement.controller;
import com.example.colonyManagement.entity.AssetAssignment;
import com.example.colonyManagement.entity.Building;
import com.example.colonyManagement.entity.Occupancy;
import com.example.colonyManagement.entity.Person;
import com.example.colonyManagement.service.OccupancyService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController

@RequestMapping("/api/occupancies")
public class OccupancyController {

    private final OccupancyService occupancyService;

    public OccupancyController(OccupancyService occupancyService) {
        this.occupancyService = occupancyService;}

    @PostMapping
    public ResponseEntity<Occupancy>createOccupancy(@RequestBody Occupancy occupancy){
        Occupancy savedOccupancy = occupancyService.createOccupancy(occupancy);
        return new ResponseEntity<>(savedOccupancy, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Occupancy>> getAllOccupancy() {
        List<Occupancy> occupancyList = occupancyService.getAllOccupancy();
        return ResponseEntity.ok(occupancyList);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Occupancy>getOccupancyById(@PathVariable int id){
        return occupancyService.getOccupancyById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/person/{personId}")
    public ResponseEntity<List<Occupancy>> getOccupancyByPerson(@PathVariable int personId) {
        List<Occupancy> occupancies = occupancyService.getOccupancyByPerson(personId);
        return ResponseEntity.ok(occupancies);}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>deleteOccupancy(@PathVariable int id){
        occupancyService.deleteOccupancy(id);
        return ResponseEntity.noContent().build();
    }

}