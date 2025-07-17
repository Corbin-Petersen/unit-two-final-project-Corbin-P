package com.example.wistlish_app.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    // This class can be used to configure security settings for the application.
    // For example, you can define authentication providers, password encoders, and security filters here.

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/items/scrape-img").permitAll()
                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable()); // Optional: disable CSRF for APIs
        return http.build();
    }
}
