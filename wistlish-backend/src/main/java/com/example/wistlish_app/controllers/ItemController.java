package com.example.wistlish_app.controllers;

import com.example.wistlish_app.repositories.ItemRepository;
import com.example.wistlish_app.repositories.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ItemController {
    // connect repositories
    @Autowired
    ItemRepository itemRepository;
    @Autowired
    WishlistRepository wishlistRepository;

    // GET all items in a list

}
