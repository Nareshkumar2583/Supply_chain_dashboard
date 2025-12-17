package com.example.supply_dashboard;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS configuration for the Supply Chain Dashboard API.
 * This configuration explicitly allows the frontend applications running on
 * common development ports (3000 and 5173) to access the backend API on port 8080.
 */
@Configuration
class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Apply this configuration to all /api endpoints
                registry.addMapping("/api/**")
                        // Explicitly allow the frontend running on 5173 (your Vite/frontend port)
                        // and 3000 (a common React port).
                        .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                        // Allow all necessary HTTP methods
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        // Allow all headers
                        .allowedHeaders("*");
            }
        };
    }
}
