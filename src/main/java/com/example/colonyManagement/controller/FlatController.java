package com.example.colonyManagement.controller;
import com.example.colonyManagement.entity.Flat;
import com.example.colonyManagement.service.FlatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController

@RequestMapping("/api/flats")
 public class FlatController {

        private final FlatService flatService;

        public FlatController(FlatService flatService) {
            this.flatService = flatService;
        }
    @PostMapping
    public ResponseEntity<Flat>createFlat(@RequestBody Flat flat){
        Flat savedFlats = flatService.createFlat(flat);
        return new ResponseEntity<>(savedFlats, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Flat>>getAllFlats() {
            List<Flat> flats = flatService.getAllFlats();
            return ResponseEntity.ok(flats);
}
    @GetMapping("/{id}")
    public ResponseEntity<Flat>getFlatById(@PathVariable Long id){
        return flatService.getFlatById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Flat>updateFlat(@PathVariable Long id, @RequestBody Flat flatDetails){
        return flatService.updateFlat(id, flatDetails).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void>deleteFlat(@PathVariable Long id){
        flatService.deleteFlat(id);
        return ResponseEntity.noContent().build();
    }
}
