package com.example.wistlish_app.controllers;

import com.example.wistlish_app.models.User;
import com.example.wistlish_app.models.Wishlist;
import com.example.wistlish_app.models.dto.WishlistDTO;
import com.example.wistlish_app.repositories.UserRepository;
import com.example.wistlish_app.repositories.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
public class WishlistController {
    // connect repositories
    @Autowired
    WishlistRepository wishlistRepository;
    @Autowired
    UserRepository userRepository;

    // GET all lists for a user
    @GetMapping(value="/{userId}", produces= MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllLists(@PathVariable(value = "userId") int userId) {
        List<Wishlist> userLists = wishlistRepository.findAllByUserId(userId);
        if (userLists == null || userLists.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No lists found for user with ID: " + userId);
        } else {
            return ResponseEntity.ok(userLists);
        }
    }

    // GET a specific list by ID
    @GetMapping(value="/list/{listId}", produces= MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getListById(@PathVariable(value = "listId") int listId) {
        Wishlist list = wishlistRepository.findById(listId).orElse(null);
        if (list == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("List with ID: " + listId + " not found.");
        } else {
            return ResponseEntity.ok(list);
        }
    }

    // POST a new list
    @PostMapping(value="/add", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createNewList(@RequestBody WishlistDTO listData) {
        User user = userRepository.findById(listData.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with ID: " + listData.getUserId() + " not found.");
        }
        Wishlist newList = new Wishlist(listData.getName(), listData.getDescription(), listData.getUseClaimed(), user);
        wishlistRepository.save(newList);
        return ResponseEntity.status(HttpStatus.CREATED).body(newList);
    }

    // PUT to update an existing list
    @PutMapping(value="/update/{listId}", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateList(@PathVariable(value = "listId") int listId, @RequestBody Wishlist updatedList) {
        Wishlist existingList = wishlistRepository.findById(listId).orElse(null);
        if (existingList == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("List with ID: " + listId + " not found.");
        }
        existingList.setName(updatedList.getName());
        existingList.setDescription(updatedList.getDescription());
        existingList.setUseClaimed(updatedList.getUseClaimed());
        existingList.setLastUpdate();
        wishlistRepository.save(existingList);
        return ResponseEntity.ok(existingList);
    }

    // DELETE a list
    @DeleteMapping(value="/delete/{listId}")
    public ResponseEntity<?> deleteList(@PathVariable(value = "listId") int listId) {
        Wishlist list = wishlistRepository.findById(listId).orElse(null);
        if (list == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("List with ID: " + listId + " not found.");
        }
        wishlistRepository.delete(list);
        return ResponseEntity.noContent().build();
    }
}