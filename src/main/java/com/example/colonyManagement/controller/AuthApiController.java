
<<<<<<< HEAD
package com.example.colonyManagement.controller;

import com.example.colonyManagement.entity.User;
import com.example.colonyManagement.repository.UserRepository;
=======
import com.example.colonymanagement.model.UserEntity;
import com.example.colonymanagement.repository.UserRepository;
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");

<<<<<<< HEAD
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username and password are required!");
        }

        if (userRepository.existsByUsername(username) || (email != null && userRepository.existsByEmail(email))) {
            return ResponseEntity.badRequest().body("Username or Email already taken!");
        }

        String userRole = "admin".equalsIgnoreCase(username) ? "ADMIN" : "RESIDENT";

        User newUser = User.builder()
                .username(username)
                .email(email != null && !email.trim().isEmpty() ? email : username + "@colony.local")
                .password(passwordEncoder.encode(password))
                .role(userRole)
                .enabled(true)
                .build();

        userRepository.save(newUser);
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "User registered successfully!");
        return ResponseEntity.ok(resp);
=======
        if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Username or Email already taken!");
        }

        UserEntity newUser = new UserEntity();
        newUser.setUsername(username);
        newUser.setEmail(email);
        // HASH THE PASSWORD before saving to database
        newUser.setPassword(passwordEncoder.encode(password));

        userRepository.save(newUser);
        return ResponseEntity.ok("User registered successfully!");
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> request, HttpSession session) {
        String username = request.get("username");
        String password = request.get("password");

<<<<<<< HEAD
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!user.isEnabled()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account disabled by Admin.");
            }
            if (passwordEncoder.matches(password, user.getPassword())) {
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
                response.put("role", user.getRole());
                return ResponseEntity.ok(response);
            }
=======
        Optional<UserEntity> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            UserEntity user = userOpt.get();

            // Set user profile into the server session tracking memory
            session.setAttribute("LOGGED_IN_USER", user.getUsername());

            Map<String, String> response = new HashMap<>();
            response.setStatus("SUCCESS");
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            return ResponseEntity.ok(response);
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials supplied.");
    }
<<<<<<< HEAD

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
            resp.put("username", user.getUsername());
            resp.put("email", user.getEmail());
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

=======
}
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
