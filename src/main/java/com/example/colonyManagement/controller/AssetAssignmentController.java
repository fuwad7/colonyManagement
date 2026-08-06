package com.example.colonyManagement.controller;

import com.example.colonyManagement.entity.AssetAssignment;
import com.example.colonyManagement.service.AssetAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController

@RequestMapping("/api/asset-Assignment")
public class AssetAssignmentController {

    private final AssetAssignmentService assetAssignmentService;

    public AssetAssignmentController(AssetAssignmentService assetAssignmentService) {
        this.assetAssignmentService = assetAssignmentService;
    }

    @PostMapping
    public ResponseEntity<AssetAssignment> createAssignment(@RequestBody AssetAssignment assetAssignment) {
        AssetAssignment savedAssignment = assetAssignmentService.createAssignment(assetAssignment);
        return new ResponseEntity<>(savedAssignment, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AssetAssignment>> getAllAssignments() {
        List<AssetAssignment> assetAssignments = assetAssignmentService.getAllAssignments();
        return ResponseEntity.ok(assetAssignments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssetAssignment> getAssignmentById(@PathVariable Long id) {
        return assetAssignmentService.getAssignmentById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/person/{personId}")
    public ResponseEntity<List<AssetAssignment>> getAssignmentsByPerson(@PathVariable Long personId) {
        List<AssetAssignment> assignments = assetAssignmentService.getAssignmentsByPerson(personId);
        return ResponseEntity.ok(assignments);
    }
    @GetMapping("/asset/{assetId}")
    public ResponseEntity<List<AssetAssignment>> getAssignmentsByAsset(@PathVariable Long assetId) {
        List<AssetAssignment> assignments = assetAssignmentService.getAssignmentsByAsset(assetId);
        return ResponseEntity.ok(assignments);
    }
    @PutMapping("/{id}")
    public ResponseEntity<AssetAssignment> updateAssignment(@PathVariable Long id, @RequestBody AssetAssignment assetAssignment) {
        try {
            AssetAssignment updatedAssignment = assetAssignmentService.updateAssignment(id, assetAssignment);
            return ResponseEntity.ok(updatedAssignment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void>deleteAssignment(@PathVariable Long id){
        assetAssignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}