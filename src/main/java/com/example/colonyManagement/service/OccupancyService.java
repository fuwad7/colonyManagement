package com.example.colonyManagement.service;
import com.example.colonyManagement.entity.Occupancy;
import com.example.colonyManagement.repository.OccupancyRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OccupancyService {
    private OccupancyRepository occupancyRepository;
public Occupancy saveOccupancy(Occupancy occupancy) {
    return occupancyRepository.save(occupancy);
}
public List<Occupancy>getAllOccupancy(){
    return occupancyRepository.findAll();
}
public Optional<Occupancy>getOccupancyById(int id){
    return occupancyRepository.findById(id);
}
public void deleteOccupancy(int id){
 occupancyRepository.deleteById(id);
}
}
