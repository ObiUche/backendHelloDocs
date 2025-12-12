package com.hellodocs.app.controller;

import com.hellodocs.app.dto.AuthRequest;
import com.hellodocs.app.dto.AuthResponse;
import com.hellodocs.app.dto.UserDTO;
import com.hellodocs.app.entity.User;
import com.hellodocs.app.security.JwtUtil;
import com.hellodocs.app.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@Valid @RequestBody AuthRequest authRequest){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(),authRequest.getPassword())
        );
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        User user = userService.findByUsername(authRequest.getUsername());
        userService.updateLastLogin(authRequest.getUsername());

        return ResponseEntity.ok(new AuthResponse(jwt, user.getUsername(), user.getEmail(),user.getRole()));
    }


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO userDTO){
        User user = userService.registerUser(userDTO);

        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt , user.getUsername(), user.getEmail(), user.getRole()));
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsernameAvailability(@PathVariable String username){
        boolean exists = userService.existByUsername(username);
        return ResponseEntity.ok().body("{\"available\": " + !exists + "}");
    }

}
