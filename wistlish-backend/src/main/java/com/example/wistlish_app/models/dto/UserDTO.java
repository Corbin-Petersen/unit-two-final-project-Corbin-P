package com.example.wistlish_app.models.dto;

import jakarta.validation.constraints.*;

public class UserDTO {
    // DTO necessary for user creation WITH VALIDATION
    @NotBlank(message = "First Name is required")
    private String firstName;
    @NotBlank(message = "Last Name is required")
    private String lastName;
    @Email(message = "Enter a valid email address")
    @NotNull(message = "Email cannot be empty")
    private String email;
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String userPass;

    // Getters and Setters
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
}
