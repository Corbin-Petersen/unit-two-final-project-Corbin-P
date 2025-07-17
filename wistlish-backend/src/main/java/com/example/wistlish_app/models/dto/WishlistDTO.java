package com.example.wistlish_app.models.dto;

import jakarta.persistence.Column;

public class WishlistDTO {
    // make fields necessary for wishlist creation
    private String name;
    private String description;
    private boolean useClaimed;
    private int userId;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean getUseClaimed() {
        return useClaimed;
    }

    public void setUseClaimed(boolean useClaimed) {
        this.useClaimed = useClaimed;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
