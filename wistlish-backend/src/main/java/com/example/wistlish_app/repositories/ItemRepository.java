package com.example.wistlish_app.repositories;

import com.example.wistlish_app.models.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    // Method to find all items by wishlist ID
    List<Item> findAllByListId(int listId);
}