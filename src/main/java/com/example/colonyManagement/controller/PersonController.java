package com.example.colonyManagement.controller;
import com.example.colonyManagement.entity.Person;
import com.example.colonyManagement.service.PersonService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController

@RequestMapping("/api/persons")
public class PersonController {
    private final PersonService personService;

    public PersonController (PersonService personService){
        this.personService = personService;
    }
    @PostMapping
    public ResponseEntity<Person>createPerson(@RequestBody Person person){
        Person savedPerson = personService.createPerson(person);
        return new ResponseEntity<>(savedPerson, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Person>> getAllPerson() {
        List<Person> personList = personService.getAllPerson();
        return ResponseEntity.ok(personList);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Person>getPersonById(@PathVariable Long id){
        return personService.getPersonById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Person> updatePerson(@PathVariable Long id, @RequestBody Person personDetails) {
        try {Person updatedPerson = personService.updatePerson(id, personDetails);
        return ResponseEntity.ok(updatedPerson);
        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();}
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void>deletePerson(@PathVariable Long id){
        personService.deletePerson(id);
        return ResponseEntity.noContent().build();
    }
}