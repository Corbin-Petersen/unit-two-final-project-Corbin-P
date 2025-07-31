package com.example.wistlish_app.controllers;

import com.example.wistlish_app.models.Item;
import com.example.wistlish_app.models.Wishlist;
import com.example.wistlish_app.models.dto.ItemDTO;
import com.example.wistlish_app.repositories.ItemRepository;
import com.example.wistlish_app.repositories.WishlistRepository;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    // connect repositories
    @Autowired
    ItemRepository itemRepository;
    @Autowired
    WishlistRepository wishlistRepository;

    // method to scrape images from a URL using JSoup
    @GetMapping(value="/scrape-img", produces= MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getImagesFromUrl(@RequestParam String url) {
        try {
            Document doc = Jsoup
                    .connect(url)
                    .ignoreContentType(true)
                    .ignoreHttpErrors(true)
                    .method(Connection.Method.POST)
                    .userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8")
                    .header("Accept-Language", "en-US,en;q=0.9")
                    .header("Accept-Encoding", "gzip, deflate, br")
                    .header("Priority", "u=1,i")
                    .header("Sec-Ch-Ua", "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"")
                    .header("Sec-Ch-Ua-Mobile", "?0")
                    .header("Sec-Fetch-Dest", "document")
                    .header("Sec-Fetch-Mode", "navigate")
                    .header("Sec-Fetch-site", "none")
                    .header("Cache-Control", "max-age=0")
                    .header("Upgrade-Insecure-Requests", "1")
                    .referrer("https://www.google.com")
                    .timeout(30000)
                    .followRedirects(true)
                    .get();
            Elements images = doc.select("img[src]");
            List<String> imageUrls = new ArrayList<>();
            if (images != null) {
                for (Element img : images) {
                    imageUrls.add(img.absUrl("src"));
                }
                return ResponseEntity.ok(imageUrls);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No images found at the provided URL.");
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    // GET a specific item by ID
    @GetMapping(value="/{itemId}", produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getItemById(@PathVariable(value = "itemId") int itemId) {
        Item item = itemRepository.findById(itemId).orElse(null);
        if (item == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item with ID: " + itemId + " not found.");
        } else {
            return ResponseEntity.ok(item);
        }
    }

    // POST a new item
    @PostMapping(value="/add", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createNewItem(@RequestBody ItemDTO itemData) {
        Wishlist list = wishlistRepository.findById(itemData.getListId()).orElse(null);
        if (list == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("List with ID: " + itemData.getListId() + " not found.");
        }
        Item newItem = new Item(itemData.getName(), itemData.getItemUrl(), itemData.getImageUrl(), itemData.getQuantity(), itemData.getCost(), list);
        itemRepository.save(newItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(newItem);
    }

    // PUT to update an existing item and toggle it's claimed status
    @PutMapping(value="/{itemId}/update", produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> toggleClaimed(@PathVariable(value = "itemId") int itemId) {
        Item existingItem = itemRepository.findById(itemId).orElse(null);
        if (existingItem == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item with ID: " + itemId + " not found.");
        }
        existingItem.setIsClaimed(!existingItem.getIsClaimed());
        itemRepository.save(existingItem);
        return ResponseEntity.ok(existingItem);
    }

    // DELETE an item
    @DeleteMapping("/{itemId}/delete")
    public ResponseEntity<?> deleteItem(@PathVariable(value = "itemId") int itemId) {
        Item item = itemRepository.findById(itemId).orElse(null);
        if (item == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item with ID: " + itemId + " not found.");
        }
        itemRepository.delete(item);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
