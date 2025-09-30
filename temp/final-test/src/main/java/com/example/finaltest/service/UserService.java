package com.example.finaltest.service;

import com.example.finaltest.dto.UserDTO;
import com.example.finaltest.entity.User;
import com.example.finaltest.mapper.UserMapper;
import com.example.finaltest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    // Basic CRUD Operations
    @Cacheable(value = "users", key = "'all'")
    public List<UserDTO> findAll() {
        logger.info("Finding all users");
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "userById", key = "#id")
    public Optional<UserDTO> findById(Long id) {
        logger.info("Finding user with id: {}", id);
        return userRepository.findById(id)
                .map(userMapper::toDTO);
    }

    @Transactional
    @CacheEvict(value = {"users", "userById"}, allEntries = true)
    public UserDTO save(UserDTO userDTO) {
        logger.info("Saving user: {}", userDTO);
        validateUserDTO(userDTO);
        User user = userMapper.toEntity(userDTO);
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

    @Transactional
    @CachePut(value = "userById", key = "#id")
    @CacheEvict(value = "users", allEntries = true)
    public UserDTO update(Long id, UserDTO userDTO) {
        logger.info("Updating user with id: {}", id);
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        validateUserDTO(userDTO);
        userMapper.updateEntityFromDTO(existingUser, userDTO);
        User updatedUser = userRepository.save(existingUser);
        return userMapper.toDTO(updatedUser);
    }

    @Transactional
    @CacheEvict(value = {"users", "userById"}, key = "#id")
    public void deleteById(Long id) {
        logger.info("Deleting user with id: {}", id);
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }

    // Advanced Operations
    public Page<UserDTO> findAllPaginated(Pageable pageable) {
        logger.info("Finding all users with pagination: {}", pageable);
        return userRepository.findAll(pageable)
                .map(userMapper::toDTO);
    }

    // Custom business methods
    public List<UserDTO> findByStatus(String status) {
        logger.info("Finding users by status: {}", status);
        // Implementar lógica específica según el dominio
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Validation Methods
    private void validateUserDTO(UserDTO userDTO) {
        logger.debug("Validating user DTO: {}", userDTO);
        
        if (userDTO == null) {
            throw new IllegalArgumentException("User DTO cannot be null");
        }
        
        if (userDTO.getEmail() != null && !userDTO.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    // Business Logic Methods
}