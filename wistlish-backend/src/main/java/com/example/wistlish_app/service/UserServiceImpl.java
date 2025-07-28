package com.example.wistlish_app.service;

import com.example.wistlish_app.models.User;
import com.example.wistlish_app.models.dto.UserDTO;
import com.example.wistlish_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    @Lazy
    PasswordEncoder passwordEncoder;

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User saveUser(UserDTO user) {
        // Check if the user already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("User with email " + user.getEmail() + " already exists.");
        }
        // Encrypt the password before saving
        user.setUserPass(passwordEncoder.encode(user.getUserPass()));
        User newUser = new User(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getUserPass());
        return userRepository.save(newUser);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return existingUser;
    }
}