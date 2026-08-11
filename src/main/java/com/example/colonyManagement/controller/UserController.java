package com.example.colonyManagement.controller;

import com.example.colonyManagement.entity.User;
import com.example.colonyManagement.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    private boolean isAdmin(HttpSession session) {
        return session == null || !"ADMIN".equals(session.getAttribute("ROLE"));
    }

    @PostMapping
    public ResponseEntity<?> saveUser(@RequestBody User user, HttpSession session) {
        if (isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Only Admin can create users.");
        }
        User savedUser = userService.saveUser(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers(HttpSession session) {
        if (isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied.");
        }
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id, HttpSession session) {
        if (isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied.");
        }
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email, HttpSession session) {
        if (isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied.");
        }
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User userDetails,
            HttpSession session) {
        if (isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied.");
        }

        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/profile")
    public ResponseEntity<?> updateMyProfile(
            @RequestBody User userDetails,
            HttpSession session) {

        String username =
                (String) session.getAttribute("LOGGED_IN_USER");
        if (username == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Not logged in.");
        }
        try {
            User currentUser =
                    userService
                            .getUserByUsername(username)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            User updatedUser =
                    userService.updateProfile(
                            currentUser.getId(),
                            userDetails
                    );

            return ResponseEntity.ok(updatedUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id, HttpSession session) {
        if (isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied.");
        }

        try {
            User updatedUser = userService.toggleUserStatus(id);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpSession session) {
        if (isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied.");
        }

        try {
            String role = body.get("role");
            User updatedUser = userService.changeUserRole(id, role);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, HttpSession session) {
        if (isAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied.");
        }
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}