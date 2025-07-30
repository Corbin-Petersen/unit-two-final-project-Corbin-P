package com.example.wistlish_app.service;

import com.example.wistlish_app.models.User;
import com.example.wistlish_app.models.dto.UserDTO;

public interface UserService {
    User findByEmail(String email);
    User findById(int id);
    User saveUser(UserDTO user);
}
