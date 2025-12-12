package com.hellodocs.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This ensures that requests to /api/flashcards go to the controller, not static resources
        registry.addResourceHandler("/api/flashcards/**")
                .addResourceLocations("classpath:/static/");
    }
}