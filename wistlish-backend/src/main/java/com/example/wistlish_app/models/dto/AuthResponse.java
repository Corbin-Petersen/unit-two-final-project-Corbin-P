package com.example.wistlish_app.models.dto;

public class AuthResponse {
    private int id;
    private String token;
    private String firstName;
    private String lastName;

    public AuthResponse(int id, String firstName, String lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public AuthResponse(int id, String firstName, String lastName, String token) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.token = token;
    }

    // Getters ONLY to send JWT token in cookie
    public String getToken() {
        return token;
    }
    public int getId() {
        return id;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getLastName() {
        return lastName;
    }
}
