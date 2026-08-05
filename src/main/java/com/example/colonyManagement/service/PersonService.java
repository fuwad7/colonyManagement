package com.example.colonyManagement.service;

import com.example.colonyManagement.entity.Person;
import com.example.colonyManagement.repository.PersonRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PersonService {
private  PersonRepository personRepository;

public Person createPerson(Person person){
    return personRepository.save(person);
}
public List<Person>getAllPerson(){
    return personRepository.findAll();
}
public Optional<Person>getPersonById(Long id){
    return personRepository.findById(id);
}
public Person updatePerson(Long id,Person personDetails){
    return personRepository.findById(id).map(person -> {
        personDetails.setFullName(personDetails.getFullName());
        personDetails.setPersonId(personDetails.getPersonId());
        personDetails.setPhone(personDetails.getPhone());
        personDetails.setUser(personDetails.getUser());
        return personRepository.save(person);
    }).orElseThrow(() -> new RuntimeException("Person not found with id: " + id));

}
public void deletePerson(Long id) {
    personRepository.deleteById(id);
}
}
