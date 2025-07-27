package com.example.wistlish_app.models.dto;

public class AuthResponse {
    private String email;
    private String token;

    public AuthResponse(String email, String token) {
        this.email = email;
        this.token = token;
    }

    // Getters ONLY to send JWT token in cookie
    public String getEmail() {
        return email;
    }
    public String getToken() {
        return token;
    }
}
