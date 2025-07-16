package com.example.wistlish_app.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Item {
    // creating the structure of the item model with necessary foreign keys
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String itemUrl;
    private String imageUrl;
    private int quantity;
    private int cost;
    private boolean isClaimed;
    private LocalDate createdOn;

    @ManyToOne
    @JoinColumn(name = "list_id", referencedColumnName = "id")
    @JsonBackReference
    private Wishlist list;

    // Constructors
    public Item() {}
    public Item(String name, String itemUrl, String imageUrl, int quantity, int cost, Wishlist list) {
        this.name = name;
        this.itemUrl = itemUrl;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.cost = cost;
        this.isClaimed = false;
        this.createdOn = LocalDate.now();
        this.list = list;
    }

    // Getters and Setters

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getItemUrl() {
        return itemUrl;
    }

    public void setItemUrl(String itemUrl) {
        this.itemUrl = itemUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }

    public boolean getIsClaimed() {
        return isClaimed;
    }

    public void setIsClaimed(boolean isClaimed) {
        this.isClaimed = isClaimed;
    }

    public LocalDate getCreatedOn() {
        return createdOn;
    }

//    public void setCreatedOn(LocalDate createdOn) {
//        this.createdOn = createdOn;
//    }

    public Wishlist getList() {
        return list;
    }

    public void setList(Wishlist list) {
        this.list = list;
    }
}
