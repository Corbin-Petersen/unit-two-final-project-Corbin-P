package com.example.wistlish_app.controllers;

import com.example.wistlish_app.models.User;
import com.example.wistlish_app.models.Wishlist;
import com.example.wistlish_app.models.dto.AuthResponse;
import com.example.wistlish_app.repositories.UserRepository;
import com.example.wistlish_app.repositories.WishlistRepository;
import com.example.wistlish_app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shared")
public class ShareController {

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;
    @Autowired
    WishlistRepository wishlistRepository;

    @GetMapping(value = "/user/{userID}info", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getListOwner(@PathVariable(value = "userID") int userID) {
        User user = userService.findById(userID);
        AuthResponse userInfo = new AuthResponse(user.getId(), user.getFirstName(), user.getLastName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with ID: " + userID + " not found.");
        }
        return ResponseEntity.ok(userInfo);
    }

    // GET a Shared list by ID
    @GetMapping(value = "/list/{listId}info", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getSharedList(@PathVariable(value = "listId") int listId) {
        Wishlist list = wishlistRepository.findById(listId).orElse(null);
        if (list == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("List with ID: " + listId + " not found.");
        } else {
            return ResponseEntity.ok(list);
        }
    }
}
