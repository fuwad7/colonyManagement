package com.example.colonyManagement.service;

import com.example.colonyManagement.entity.User;
import java.util.List;
import com.example.colonyManagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service

public class UserService {
    @Autowired
private UserRepository userRepository;
 public User saveUser(User user){
     return userRepository.save(user);
 }
 public List<User>getAllUser(Long id){
     return userRepository.findAll();
 }
 public Optional<User>getUserByEmail(String email){
     return userRepository.findByEmail(email);
 }

 public Optional<User>getUserById(Long id){
     return userRepository.findById(id);
 }
 public User updateUser(Long id, User userDetails){
     return userRepository.findById(id).map(user -> {
         userDetails.setEmail(userDetails.getEmail());
         userDetails.setPassword(userDetails.getPassword());
         userDetails.setRole(userDetails.getRole());
         return userRepository.save(user);
     }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));

 }
 public void deleteUser(Long id){
     userRepository.deleteById(id);
 }
}