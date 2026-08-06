package com.example.colonyManagement.controller;

import com.example.colonyManagement.entity.Asset;
import com.example.colonyManagement.service.AssetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController

@RequestMapping("/api/assets")
public class AssetController {

private final AssetService assetService;

public AssetController (AssetService assetService){
    this.assetService = assetService;
}
@GetMapping
public ResponseEntity<List<Asset>>getAllAssets(){
    List<Asset> assets = assetService.getAllAssets();
    return ResponseEntity.ok(assets);
}
    @PutMapping("/{id}")
    public ResponseEntity<Asset> updateAsset(@PathVariable Long id, @RequestBody Asset updated) {
        try {
            return ResponseEntity.ok(assetService.updateAsset(id, updated));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

@GetMapping("/{id}")
    public ResponseEntity<Asset>getAssetById(@PathVariable Long id){
    return assetService.getAssetById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
}
@PostMapping
    public ResponseEntity<Asset>saveAsset(@RequestBody Asset asset){
    Asset savedAsset = assetService.saveAsset(asset);
    return new ResponseEntity<>(savedAsset, HttpStatus.CREATED);
}
@GetMapping("/type")
public ResponseEntity<List<Asset>>getAssetsByType(@RequestParam Asset.AssetType type){
List<Asset> assets = assetService.getAssetsByType(type);
return ResponseEntity.ok(assets);
}
@DeleteMapping("/{id}")
    public ResponseEntity<Void>deleteAsset(@PathVariable Long id){
    assetService.deleteAsset(id);
    return ResponseEntity.noContent().build();
}
}