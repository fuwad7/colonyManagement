package com.example.colonyManagement.service;
import com.example.colonyManagement.entity.Occupancy;
import com.example.colonyManagement.repository.OccupancyRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OccupancyService {
    private OccupancyRepository occupancyRepository;
public Occupancy createOccupancy(Occupancy occupancy) {
    return occupancyRepository.save(occupancy);
}
public List<Occupancy>getAllOccupancy(){
    return occupancyRepository.findAll();
}
public Optional<Occupancy>getOccupancyById(int id){
    return occupancyRepository.findById(id);
}
public List<Occupancy>getOccupancyByPerson(int personId){
    return occupancyRepository.findByPersonId(personId);
}
public List<Occupancy>getOccupancyByType(Occupancy.OccupancyType type){
    return occupancyRepository.findByOccupancyType(type);
}
public Occupancy UpdateOccupancy(int id,Occupancy occupancyDetails){
    Occupancy existingOccupancy = occupancyRepository.findById(id);
existingOccupancy.setOccupancyType(occupancyDetails.getOccupancyType());
existingOccupancy.setFlat(occupancyDetails.getFlat());
existingOccupancy.setRentedFrom(occupancyDetails.getRentedFrom());
existingOccupancy.setPerson(occupancyDetails.getPerson());
return occupancyRepository.save(existingOccupancy);
}
public void deleteOccupancy(int id){
 occupancyRepository.deleteById(id);
}
}
