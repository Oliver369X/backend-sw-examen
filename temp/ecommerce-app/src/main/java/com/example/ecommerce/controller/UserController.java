package com.example.ecommerce.controller;

import com.example.ecommerce.dto.UserDTO;
import com.example.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.validation.annotation.Validated;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
@Validated
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    // Basic CRUD Operations
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        logger.info("Getting all s");
        List<UserDTO> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<UserDTO>> getAllUsersPaginated(
            @PageableDefault(size = 10) Pageable pageable) {
        logger.info("Getting all s with pagination: {}", pageable);
        Page<UserDTO> users = userService.findAllPaginated(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        logger.info("Getting  by id: {}", id);
        Optional<UserDTO> user = userService.findById(id);
        return user.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
        logger.info("Creating new : {}", userDTO);
        try {
            UserDTO savedUser = userService.save(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error creating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, 
                                                             @Valid @RequestBody UserDTO userDTO) {
        logger.info("Updating  with id: {}", id);
        try {
            UserDTO updatedUser = userService.update(id, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error updating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            logger.error("Error updating : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        logger.info("Deleting  with id: {}", id);
        try {
            userService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Custom endpoints
    @GetMapping("/status/{status}")
    public ResponseEntity<List<UserDTO>> getByStatus(@PathVariable String status) {
        logger.info("Getting s by status: {}", status);
        List<UserDTO> users = userService.findByStatus(status);
        return ResponseEntity.ok(users);
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("UserController is healthy");
    }

    // Custom endpoints
}
