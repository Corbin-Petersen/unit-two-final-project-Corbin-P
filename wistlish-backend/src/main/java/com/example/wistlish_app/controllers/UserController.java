package com.example.wistlish_app.controllers;

import com.example.wistlish_app.models.User;
import com.example.wistlish_app.models.dto.AuthResponse;
import com.example.wistlish_app.models.dto.UserDTO;
import com.example.wistlish_app.repositories.UserRepository;
import com.example.wistlish_app.service.UserService;
import com.example.wistlish_app.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtUtil jwtUtil;

    // Register a new user
    @PostMapping(value = "/user/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createNewUser(@Valid @RequestBody UserDTO userData) {
        User existingUser = userService.findByEmail(userData.getEmail());
        if (existingUser != null) {
            return ResponseEntity.status(HttpStatus.ALREADY_REPORTED).body("User with email " + existingUser.getEmail() + " already exists.");
        }
        User newUser = userService.saveUser(userData);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authenticationResponse = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password()));
        if (authenticationResponse.isAuthenticated()) {
            final User userDetails = userService.findByEmail(loginRequest.username());
            final String jwtToken = jwtUtil.generateToken(userDetails);
            ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1)) // 1 day
                .sameSite("Strict")
                .build();
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(
                    userDetails.getId(),
                    userDetails.getFirstName(),
                    userDetails.getLastName(),
                    jwtToken)
                );
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email or password is incorrect");
        }
    }

    @GetMapping("/profile")
    public User getProfile(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        User existingUser = userService.findByEmail(email);
        if (existingUser == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return existingUser;
    }

    public record LoginRequest(String username, String password) {
    }
}
