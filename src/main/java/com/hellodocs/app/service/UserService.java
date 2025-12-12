package com.hellodocs.app.service;

import com.hellodocs.app.dto.UserDTO;
import com.hellodocs.app.entity.User;
import com.hellodocs.app.exception.DuplicateResourceException;
import com.hellodocs.app.exception.ResourceNotFoundException;
import com.hellodocs.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passswordEncoder;

    public User findByUsername(String username){
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: +" + username));
    }

    public User findByEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public User registerUser(UserDTO userDTO){
        if(userRepository.existsByUsername(userDTO.getUsername())){
            throw new DuplicateResourceException("Username is already taken");
        }

        if(userRepository.existsByUsername(userDTO.getEmail())){
            throw new DuplicateResourceException("Email is already registered");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passswordEncoder.encode(userDTO.getPassword()));

        return userRepository.save(user);

    }

    @Transactional
    public void updateLastLogin(String username){
        User user = findByUsername(username);
        user.setLastLogin(java.time.LocalDateTime.now());
        userRepository.save(user);
    }


    public boolean existByUsername(String username){
        return userRepository.existsByUsername(username);
    }

    public boolean existByEmail(String email){
        return userRepository.existsByEmail(email);
    }

}
