package com.example.colonyManagement.controller;

import com.example.colonyManagement.entity.Colony;
import com.example.colonyManagement.service.ColonyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colonies")
public class ColonyController {

    private final ColonyService colonyService;

    public ColonyController(ColonyService colonyService) {
        this.colonyService = colonyService;
    }

    @PostMapping
    public ResponseEntity<Colony> createColony(@RequestBody Colony colony) {
        Colony savedColony = colonyService.createColony(colony);
        return new ResponseEntity<>(savedColony, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Colony>> getAllColonies() {
        List<Colony> colonies = colonyService.getAllColonies();
        return ResponseEntity.ok(colonies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Colony> getColonyById(@PathVariable Long id) {
        return colonyService.getColonyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Colony> updateColony(@PathVariable Long id,
                                               @RequestBody Colony colonyDetails) {
        return colonyService.updateColony(id, colonyDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColony(@PathVariable Long id) {
        colonyService.deleteColony(id);
        return ResponseEntity.noContent().build();
    }
}
