package com.example.wistlish_app.controllers;

import com.example.wistlish_app.models.User;
import com.example.wistlish_app.models.dto.UserDTO;
import com.example.wistlish_app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    AuthenticationManager authenticationManager;

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
        Authentication authenticationRequest = UsernamePasswordAuthenticationToken
                .unauthenticated(loginRequest.username(), loginRequest.password());
        Authentication authenticationResponse =
                authenticationManager.authenticate(authenticationRequest);
        if (authenticationResponse.isAuthenticated()) {
            User user = userService.findByEmail(loginRequest.username());
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email or password is incorrect");
        }
    }

    public record LoginRequest(String username, String password) {
    }
}
