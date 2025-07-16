package com.example.wistlish_app.controllers;

import com.example.wistlish_app.repositories.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ItemController {

    @Autowired
    ItemRepository itemRepository;

}
