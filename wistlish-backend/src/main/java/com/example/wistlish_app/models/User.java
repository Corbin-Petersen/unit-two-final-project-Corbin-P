package com.example.wistlish_app.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class User {
    // creating the structure with necessary foreign keys
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;

    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String userPass;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_img", referencedColumnName = "id")
    private UserImage userImg;

    @OneToMany(mappedBy="user")
    @JsonManagedReference
    private final List<Wishlist> lists = new ArrayList<>();

    // Constructors
    public User() {}
    public User(String firstName, String lastName, String email, String username, String userPass) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.userPass = userPass;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserPass() {
        return userPass;
    }

    public void setUserPass(String userPass) {
        this.userPass = userPass;
    }

    public UserImage getUserImg() {
        return userImg;
    }

    public void setUserImg(UserImage userImg) {
        this.userImg = userImg;
    }

    public List<Wishlist> getLists() {
        return lists;
    }
}