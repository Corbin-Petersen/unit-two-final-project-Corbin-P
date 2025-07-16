package com.example.wistlish_app.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Wishlist {
    //
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    @Column(length = 500)
    private String description;
    @Column(columnDefinition = "TINYINT") // Using TINYINT for boolean in MySQL
    private boolean useClaimed;
    private LocalDate createdOn;
    private LocalDate lastUpdate;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonBackReference
    private User user;

    @OneToMany(mappedBy="list")
    @JsonManagedReference
    private final List<Item> items = new ArrayList<>();

    // Constructors
    public Wishlist() {}
    public Wishlist(String name, String description, boolean useClaimed, User user) {
        this.name = name;
        this.description = description;
        this.useClaimed = useClaimed;
        this.createdOn = LocalDate.now();
        this.lastUpdate = LocalDate.now();
        this.user = user;
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

    public LocalDate getCreatedOn() {
        return createdOn;
    }

    public LocalDate getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate() {
        this.lastUpdate = LocalDate.now();
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Item> getItems() {
        return items;
}
}
