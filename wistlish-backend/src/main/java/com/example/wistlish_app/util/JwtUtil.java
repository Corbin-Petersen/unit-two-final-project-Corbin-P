package com.example.wistlish_app.util;

import com.example.wistlish_app.models.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    public String generateToken(User user) {
        // Logic to generate JWT token
        Map<String, Object> claims = HashMap<>();
        return createToken(claims, user.getEmail());
        // This is a placeholder; actual implementation will depend on your JWT library
        return "generated-jwt-token-for-" + username;
    }

    private String createToken(Map<String, Object> claims, String email) {

    }
}
