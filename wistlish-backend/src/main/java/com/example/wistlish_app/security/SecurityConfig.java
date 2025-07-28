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
import org.springframework.security.web.csrf.*;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.function.Supplier;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    JavaMailSender mailSender;
    @Autowired
    JwtRequestFilter jwtRequestFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for simplicity, enable in production
            .authorizeHttpRequests((authorize) -> authorize
                .requestMatchers("/api", "/api/items/scrape-img", "/api/user/register", "/api/login", "/api/send-reset").permitAll()
                .anyRequest().authenticated())
            .sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .logout(AbstractHttpConfigurer::disable)
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
//            .httpBasic(Customizer.withDefaults())
//            .formLogin((form) -> form
//                .loginPage("/")
//                .permitAll())
//            .oneTimeTokenLogin((ott) -> ott
//                .showDefaultSubmitPage(false)
//                .tokenGeneratingUrl("/login/ott")
//            )
//            .logout((logout) -> logout
//                .logoutSuccessUrl("/")
//            )
//            .csrf((csrf) -> csrf
//                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//                .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler()))
        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // -------------------------------------

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

    // additional class definition for handling CSRF tokens in a single-page application context
//    static final class SpaCsrfTokenRequestHandler implements CsrfTokenRequestHandler {
//        private final CsrfTokenRequestHandler plain = new CsrfTokenRequestAttributeHandler();
//        private final CsrfTokenRequestHandler xor = new XorCsrfTokenRequestAttributeHandler();
//
//        @Override
//        public void handle(HttpServletRequest request, HttpServletResponse response, Supplier<CsrfToken> csrfToken) {
//            /*  Always use XorCsrfTokenRequestAttributeHandler to provide BREACH protection of
//                the CsrfToken when it is rendered in the response body. */
//            this.xor.handle(request, response, csrfToken);
//
//            //  Render the token value to a cookie by causing the deferred token to be loaded.
//            csrfToken.get();
//        }
//
//        @Override
//        public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
//            String headerValue = request.getHeader(csrfToken.getHeaderName());
//            /*  If the request contains a request header, use CsrfTokenRequestAttributeHandler
//                to resolve the CsrfToken. This applies when a single-page application includes
//                the header value automatically, which was obtained via a cookie containing the
//                raw CsrfToken.
//                In all other cases (e.g., if the request contains a request parameter), use
//                XorCsrfTokenRequestAttributeHandler to resolve the CsrfToken. This applies
//                when a server-side rendered form includes the _csrf request parameter as a
//                hidden input.  */
//            return (StringUtils.hasText(headerValue) ? this.plain : this.xor).resolveCsrfTokenValue(request, csrfToken);
//        }
//    }
}