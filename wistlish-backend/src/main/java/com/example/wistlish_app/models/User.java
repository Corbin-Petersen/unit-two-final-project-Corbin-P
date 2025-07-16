package com.example.wistlish_app.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class User {
    // creating the structure of the user model with necessary foreign keys
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;

    private String firstName;
    private String lastName;
    private String email;
    private String userPass;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_img", referencedColumnName = "id")
    private UserImage userImg;

    @OneToMany(mappedBy="userId")
    @JsonManagedReference
    private final List<Wishlist> lists = new ArrayList<>();

    // Constructors
    public User() {}

    public User(String firstName, String lastName, String email, String userPass) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
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
