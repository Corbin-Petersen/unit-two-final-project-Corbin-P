package com.example.wistlish_app.repositories;

import com.example.wistlish_app.models.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Integer> {

}
