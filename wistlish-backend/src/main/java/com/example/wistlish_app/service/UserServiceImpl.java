package com.example.wistlish_app.service;

import com.example.wistlish_app.models.User;
import com.example.wistlish_app.models.dto.UserDTO;
import com.example.wistlish_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User saveUser(UserDTO user) {
        // Encrypt the password before saving
        user.setUserPass(passwordEncoder.encode(user.getUserPass()));
        User newUser = new User(user.getFirstName(), user.getLastName(), user.getEmail(), user.getUserPass());
        return userRepository.save(newUser);
    }
}
