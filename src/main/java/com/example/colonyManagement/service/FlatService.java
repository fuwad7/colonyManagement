package com.example.colonyManagement.service;

import com.example.colonyManagement.entity.Building;
import com.example.colonyManagement.entity.Flat;
import java.util.List;
import java.util.Optional;

import com.example.colonyManagement.repository.FlatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional

public class FlatService {
private final FlatRepository flatRepository;

public FlatService (FlatRepository flatRepository) {
    this.flatRepository = flatRepository;
}
public List<Flat>getAllFlats(){
    return flatRepository.findAll();
}
public Optional<Flat>getFlatById(Long id) {
    return flatRepository.findById(id);
}
public Flat createFlat(Flat flat){
    return flatRepository.save(flat);
}
@Transactional
public Optional<Flat> updateFlat(Long id, Flat flatDetails) {
    return flatRepository.findById(id).map(flat -> {
        flat.setFlatName(flatDetails.getFlatName());
        flat.setFloorNumber(flatDetails.getFloorNumber());
        return flatRepository.save(flat);
    });
} public void deleteFlat(Long id)
    {
    flatRepository.deleteById(id);}
}

