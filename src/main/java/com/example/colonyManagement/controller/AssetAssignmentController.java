package com.example.colonyManagement.controller;
import com.example.colonyManagement.entity.Asset;
import com.example.colonyManagement.service.AssetAssignmentService;
import com.example.colonyManagement.service.AssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController

@RequestMapping("/api/assetAssignment")
public class AssetAssignmentController {

private final AssetService assetService;

public AssetAssignmentController (AssetService assetService){
    this.assetService= assetService;
}
@GetMapping
public ResponseEntity<List<Asset>>getAllAssignments(){
    List<Asset> assets = assetService.get();
    return ResponseEntity.ok(assets);

}
