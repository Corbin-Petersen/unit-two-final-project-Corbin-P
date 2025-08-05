package com.example.wistlish_app.security;

import com.example.wistlish_app.filter.JwtRequestFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.authentication.ott.OneTimeToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.ott.OneTimeTokenGenerationSuccessHandler;
import org.springframework.security.web.authentication.ott.RedirectOneTimeTokenGenerationSuccessHandler;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    JavaMailSender mailSender;
    @Autowired
    JwtRequestFilter jwtRequestFilter;

    // Password hashing and encoding
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    // Bean necessary for JWT authentication and allowing API URLs for specific CRUD operations
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for simplicity, enable in production
            .authorizeHttpRequests((authorize) -> authorize
                .requestMatchers("/api/items/scrape-img", "/api/user/register", "/api/user/login", "/api/user/auth/**", "/api/user/profile", "/api/shared/**")
                .permitAll().anyRequest().authenticated())
            .sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .logout(AbstractHttpConfigurer::disable)
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // Filters used for validation of tokens and specifying frontend port
    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

/* -------------------------------------
FUTURE FEATURES (from here below)
 - Using one-time-tokens for resetting
   passwords
 - Authentication of user email address
------------------------------------- */

    @Bean
    public OneTimeTokenGenerationSuccessHandler oneTimeTokenHandler (){

        OneTimeTokenGenerationSuccessHandler redirectHandler = new RedirectOneTimeTokenGenerationSuccessHandler("/ott/sent");

        return (HttpServletRequest request, HttpServletResponse response, OneTimeToken oneTimeToken) -> {
            //  Build the magic link URL
            String magicLink = UriComponentsBuilder
                    .fromUriString(UrlUtils.buildFullRequestUrl(request))
                    .replacePath(request.getContextPath())
                    .replaceQuery(null)
                    .fragment(null)
                    .path("/login/ott")
                    .queryParam("token", oneTimeToken.getTokenValue())
                    .toUriString();
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@wistlish.com");
            message.setTo(oneTimeToken.getUsername());
            message.setSubject("Your One Time Login Link");
            message.setText("Use the following link to sign in into WistLish:\n\n" + magicLink);
            mailSender.send(message);
            redirectHandler.handle(request, response, oneTimeToken);
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(authenticationProvider);
    }
}