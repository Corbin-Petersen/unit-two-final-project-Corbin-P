package com.example.wistlish_app.models;

import jakarta.persistence.*;

@Entity
public class UserImage {
    // creating the structure with necessary foreign keys
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(length = 2083) // URL length limit
    private String imageUrl;

    @OneToOne(mappedBy = "userImg")
    private User user;

    // Constructor
    public UserImage() {}
    public UserImage(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}