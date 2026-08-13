package com.example.colonyManagement.controller;

import com.example.colonyManagement.entity.User;
import com.example.colonyManagement.repository.UserRepository;
import com.example.colonyManagement.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");
        String phone = request.get("phone");

        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username and password are required!");
        }

        if (userRepository.existsByUsername(username) || (email != null && !email.trim().isEmpty() && userRepository.existsByEmail(email))) {
            return ResponseEntity.badRequest().body("Username or Email already taken!");
        }

        String userRole = "admin".equalsIgnoreCase(username) ? "ADMIN" : "RESIDENT";

        User newUser = User.builder()
                .username(username)
                .email((email != null && !email.trim().isEmpty()) ? email : username + "@colony.local")
                .password(password)
                .phone(phone)
                .role(userRole)
                .enabled(true)
                .build();

        userService.saveUser(newUser);

        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "User registered successfully!");
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> request, HttpSession session) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password are required!");
        }

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {User user = userOpt.get();

            if (!user.isEnabled()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account disabled by Admin.");
            }

            if (password.equals(user.getPassword())) {
                if ("admin".equalsIgnoreCase(user.getUsername()) && !"ADMIN".equals(user.getRole())) {
                    user.setRole("ADMIN");
                    userRepository.save(user);
                }
                session.setAttribute("LOGGED_IN_USER", user.getUsername());
                session.setAttribute("ROLE", user.getRole());

                Map<String, Object> response = new HashMap<>();
                response.put("status", "SUCCESS");
                response.put("username", user.getUsername());
                response.put("email", user.getEmail());
                response.put("phone", user.getPhone());
                response.put("role", user.getRole());
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials supplied.");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        String username = (String) session.getAttribute("LOGGED_IN_USER");

        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            Map<String, Object> resp = new HashMap<>();
            resp.put("id", user.getId());
            resp.put("username", user.getUsername());
            resp.put("email", user.getEmail());
            resp.put("phone", user.getPhone());
            resp.put("role", user.getRole());
            resp.put("enabled", user.isEnabled());
            return ResponseEntity.ok(resp);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();

        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Logged out successfully");
        return ResponseEntity.ok(resp);
    }

}
