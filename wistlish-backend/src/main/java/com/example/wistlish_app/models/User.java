package com.example.wistlish_app.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Entity
public class User implements UserDetails {
    // creating the structure with necessary foreign keys
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int id;

    private String firstName;
    private String lastName;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String userPass;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_img", referencedColumnName = "id")
    private UserImage userImg;

    @OneToMany(mappedBy="user")
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

    // Overriding methods from UserDetails interface
    @Override
    public String getPassword() {
        return userPass;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Return empty collection as we are not using roles for authorization
        return Collections.emptyList();
    }

}