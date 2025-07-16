package com.example.wistlish_app.repositories;

import com.example.wistlish_app.models.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    // Method to find all lists by user
    List<Wishlist> findAllByUserId(int userId);
}
