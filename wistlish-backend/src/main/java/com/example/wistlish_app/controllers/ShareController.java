package com.example.wistlish_app.controllers;

import com.example.wistlish_app.models.Item;
import com.example.wistlish_app.models.User;
import com.example.wistlish_app.models.Wishlist;
import com.example.wistlish_app.models.dto.AuthResponse;
import com.example.wistlish_app.repositories.ItemRepository;
import com.example.wistlish_app.repositories.UserRepository;
import com.example.wistlish_app.repositories.WishlistRepository;
import com.example.wistlish_app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/shared")
public class ShareController {

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;
    @Autowired
    WishlistRepository wishlistRepository;
    @Autowired
    ItemRepository itemRepository;

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

    // PUT to update an existing item and toggle it's claimed status
    @PutMapping(value="/{itemId}/update", produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> toggleClaimed(@PathVariable(value = "itemId") int itemId, @RequestBody Map<String, String> payload) {
        Item existingItem = itemRepository.findById(itemId).orElse(null);
        String token = payload.get("claimToken");

        if (existingItem == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item with ID: " + itemId + " not found.");
        }
        if (existingItem.getIsClaimed()) {
            if (!existingItem.getClaimToken().equals(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Item already claimed.");
            }
            // Unclaim it
            existingItem.setIsClaimed(false);
            existingItem.setClaimToken(null);
        } else {
            // Claim it
            existingItem.setIsClaimed(true);
            existingItem.setClaimToken(token);
        }

        itemRepository.save(existingItem);
        return ResponseEntity.ok(existingItem);
    }

    // PUT - ADMIN update existing item and toggle it's claimed status
    @PutMapping(value="/{itemId}/admin", produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> toggleClaimed(@PathVariable(value = "itemId") int itemId) {
        Item existingItem = itemRepository.findById(itemId).orElse(null);

        if (existingItem == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item with ID: " + itemId + " not found.");
        }
        if (existingItem.getIsClaimed()) {
            // Unclaim it and clear any non-user token
            existingItem.setIsClaimed(false);
            existingItem.setClaimToken(null);
        } else {
            // Claim it without adding token - will only be editable by admin
            existingItem.setIsClaimed(true);
        }

        itemRepository.save(existingItem);
        return ResponseEntity.ok(existingItem);
    }
}
