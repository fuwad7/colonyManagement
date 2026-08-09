package com.example.colonyManagement.service;

import com.example.colonyManagement.entity.User;
import com.example.colonyManagement.entity.Person;
import com.example.colonyManagement.repository.UserRepository;
import com.example.colonyManagement.repository.PersonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PersonRepository personRepository;

    public UserService(UserRepository userRepository, PersonRepository personRepository) {
        this.userRepository = userRepository;
        this.personRepository = personRepository;
    }

    @Transactional
    public User saveUser(User user) {
        User savedUser = userRepository.save(user);
        if (personRepository.existsByUser(savedUser)) {
            Person person = Person.builder()
                    .fullName(savedUser.getUsername())
                    .personId(savedUser.getUsername())
                    .phone("")
                    .user(savedUser)
                    .build();
            personRepository.save(person);
        }
        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id)
                .map(user -> {

                    if (userDetails.getUsername() != null && !userDetails.getUsername().trim().isEmpty()) {
                        user.setUsername(userDetails.getUsername());
                    }

                    if (userDetails.getEmail() != null && !userDetails.getEmail().trim().isEmpty()) {
                        user.setEmail(userDetails.getEmail());
                    }

                    if (userDetails.getRole() != null && !userDetails.getRole().trim().isEmpty()) {
                        user.setRole(userDetails.getRole());
                    }

                    if (userDetails.getPassword() != null && !userDetails.getPassword().trim().isEmpty()) {
                        user.setPassword(userDetails.getPassword());
                    }

                    user.setEnabled(userDetails.isEnabled());

                    User updatedUser = userRepository.save(user);

                    personRepository.findByUser(updatedUser).ifPresent(p -> {
                        p.setFullName(updatedUser.getUsername());
                        p.setPersonId(updatedUser.getUsername());
                        personRepository.save(p);
                    });

                    return updatedUser;
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Transactional
    public User toggleUserStatus(Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setEnabled(!user.isEnabled());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Transactional
    public User changeUserRole(Long id, String newRole) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(newRole);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            Optional<Person> personOpt = personRepository.findByUser(user);
            if (personOpt.isPresent()) {
                personRepository.delete(personOpt.get());
            } else {
                userRepository.delete(user);
            }
        });
    }
}