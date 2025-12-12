package com.hellodocs.app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response, FilterChain chain) throws
            ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        logger.debug("JWT Filter - Path: " + path + ", Method: " + method);

        // OPTIONS requests should always pass through
        if (HttpMethod.OPTIONS.matches(method)) {
            chain.doFilter(request, response);
            return;
        }

        // Public endpoints - no JWT validation needed
        if (path.startsWith("/api/auth") || path.equals("/api/auth")) {
            chain.doFilter(request, response);
            return;
        }

        // For flashcards, ALL requests are public (temporarily for testing)
        if (path.startsWith("/api/flashcards") || path.equals("/api/flashcards")) {
            logger.debug("Allowing request to flashcards without JWT: " + method + " " + path);
            chain.doFilter(request, response);
            return;
        }

        // For ALL OTHER endpoints, check JWT token
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                logger.debug("Extracted username from JWT: " + username);
            } catch (Exception e) {
                logger.error("Error extracting username from JWT: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    logger.debug("Successfully authenticated user: " + username);
                } else {
                    logger.warn("JWT validation failed for user: " + username);
                }
            } catch (Exception e) {
                logger.error("Error during JWT validation: " + e.getMessage());
            }
        } else if (username == null && !path.startsWith("/api/flashcards") && !path.startsWith("/api/auth")) {
            logger.warn("No JWT token provided for protected endpoint: " + method + " " + path);
        }

        chain.doFilter(request, response);
    }
}