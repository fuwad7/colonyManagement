package com.example.colonyManagement.service;

import com.example.colonyManagement.entity.AssetAssignment;
import com.example.colonyManagement.repository.AssetAssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;

@Service

public class AssetAssignmentService {
    @Autowired
    private AssetAssignmentRepository assetAssignmentRepository;

public AssetAssignment saveAsset(AssetAssignment assetAssignment) {
    return assetAssignmentRepository.save(assetAssignment);
}
public List<AssetAssignment>getAllAssignments(){
    return assetAssignmentRepository.findAll();
}
public Optional<AssetAssignment>getAssignmentById(Long id){
    return assetAssignmentRepository.findById(id);
}
public List<AssetAssignment>getAssignmentsByPerson(Long personId) {
    return assetAssignmentRepository.findByPersonId(personId);
}
public List<AssetAssignment>getAssignmentsByAsset(Long assetId)
{
    return assetAssignmentRepository.findByAssetId(assetId);
}
@Transactional
    public void deleteAssignment(Long id){
    assetAssignmentRepository.deleteById(id);
}
}