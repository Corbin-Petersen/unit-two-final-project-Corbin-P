package com.example.wistlish_app.util;

import com.example.wistlish_app.models.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    public String generateToken(User user) {
        // Logic to generate JWT token
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, user.getEmail());
    }

    private String createToken(Map<String, Object> claims, String email) {
        return Jwts.builder()
                .claims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Token valid for 10 hours
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
}
