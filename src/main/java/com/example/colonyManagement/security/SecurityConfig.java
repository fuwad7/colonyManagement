
<<<<<<< HEAD
package com.example.colonyManagement.security;

=======
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
<<<<<<< HEAD
=======
        // ALWAYS securely hash passwords before writing them to the database
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
<<<<<<< HEAD
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index.html", "/login.html", "/register.html", "/js/**", "/css/**", "/views/**").permitAll()
                        .requestMatchers("/api/**").permitAll()
                        .anyRequest().permitAll()
                )
                .formLogin(form -> form.disable())
=======
                .csrf(csrf -> csrf.disable()) // Disable CSRF for easier API prototyping
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index.html", "/login.html", "/register.html", "/js/**", "/css/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll() // Allow authentication calls
                        .anyRequest().authenticated() // Block everything else (buildings, flats, etc.)
                )
                .formLogin(form -> form.disable()) // Disable default Spring Boot redirect login page
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
<<<<<<< HEAD

=======
>>>>>>> 752893a7210a04fc09168da1432e95ec85df9838
