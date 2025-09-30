package com.example.finalapp.service;

import com.example.finalapp.dto.UserDTO;
import com.example.finalapp.entity.User;
import com.example.finalapp.mapper.UserMapper;
import com.example.finalapp.repository.UserRepository;
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
    @Cacheable(value = "s", key = "'all'")
    public List<UserDTO> findAll() {
        logger.info("Finding all s");
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "", key = "#id")
    public Optional<UserDTO> findById(Long id) {
        logger.info("Finding  with id: {}", id);
        return userRepository.findById(id)
                .map(userMapper::toDTO);
    }

    @Transactional
    @CacheEvict(value = {"s", ""}, allEntries = true)
    public UserDTO save(UserDTO userDTO) {
        logger.info("Saving : {}", userDTO);
        validateUserDTO(userDTO);
        User user = userMapper.toEntity(userDTO);
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

    @Transactional
    @CachePut(value = "", key = "#id")
    @CacheEvict(value = "s", allEntries = true)
    public UserDTO update(Long id, UserDTO userDTO) {
        logger.info("Updating  with id: {}", id);
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        validateUserDTO(userDTO);
        userMapper.updateEntityFromDTO(existingUser, userDTO);
        User updatedUser = userRepository.save(existingUser);
        return userMapper.toDTO(updatedUser);
    }

    @Transactional
    @CacheEvict(value = {"s", ""}, key = "#id")
    public void deleteById(Long id) {
        logger.info("Deleting  with id: {}", id);
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
        logger.info("Finding all s with pagination: {}", pageable);
        return userRepository.findAll(pageable)
                .map(userMapper::toDTO);
    }

    // Custom business methods
    public List<UserDTO> findByStatus(String status) {
        logger.info("Finding s by status: {}", status);
        // Implementar lógica específica según el dominio
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Validation Methods
    private void validateUserDTO(UserDTO userDTO) {
        logger.debug("Validating  DTO: {}", userDTO);
        
        if (userDTO == null) {
            throw new IllegalArgumentException("User DTO cannot be null");
        }
        
        if (DTO.getEmail() != null && !DTO.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    // Business Logic Methods
}
