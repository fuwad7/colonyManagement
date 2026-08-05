package com.example.colonyManagement.service;

import com.example.colonyManagement.entity.Asset;
import com.example.colonyManagement.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service

public class AssetService {
    @Autowired
    private AssetRepository assetRepository;

    public List<Asset>getAllAssets() {
        return assetRepository.findAll();
    }
    public Optional <Asset>getAssetById(Long Id)
    {
        return assetRepository.findById(Id);
    }
    public Asset saveAsset(Asset asset) {
        return assetRepository.save(asset);

    }
    public List <Asset> getAssetsByType(Asset.AssetType type) {
        return assetRepository.findByType(type);
    }
    public void deleteAsset(Long id){
    assetRepository.deleteById(id);
    }
}
