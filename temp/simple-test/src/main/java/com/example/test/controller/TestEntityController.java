package com.example.test.controller;

import com.example.test.dto.TestEntityDTO;
import com.example.test.service.TestEntityService;
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
@RequestMapping("/api/test-entity")
@CrossOrigin(origins = "*")
@Validated
public class TestEntityController {

    private static final Logger logger = LoggerFactory.getLogger(TestEntityController.class);

    @Autowired
    private TestEntityService testentityService;

    // Basic CRUD Operations
    @GetMapping
    public ResponseEntity<List<TestEntityDTO>> getAllTestEntitys() {
        logger.info("Getting all s");
        List<TestEntityDTO> testentitys = testentityService.findAll();
        return ResponseEntity.ok(testentitys);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<TestEntityDTO>> getAllTestEntitysPaginated(
            @PageableDefault(size = 10) Pageable pageable) {
        logger.info("Getting all s with pagination: {}", pageable);
        Page<TestEntityDTO> testentitys = testentityService.findAllPaginated(pageable);
        return ResponseEntity.ok(testentitys);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestEntityDTO> getTestEntityById(@PathVariable Long id) {
        logger.info("Getting  by id: {}", id);
        Optional<TestEntityDTO> testentity = testentityService.findById(id);
        return testentity.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TestEntityDTO> createTestEntity(@Valid @RequestBody TestEntityDTO testentityDTO) {
        logger.info("Creating new : {}", testentityDTO);
        try {
            TestEntityDTO savedTestEntity = testentityService.save(testentityDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTestEntity);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error creating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestEntityDTO> updateTestEntity(@PathVariable Long id, 
                                                             @Valid @RequestBody TestEntityDTO testentityDTO) {
        logger.info("Updating  with id: {}", id);
        try {
            TestEntityDTO updatedTestEntity = testentityService.update(id, testentityDTO);
            return ResponseEntity.ok(updatedTestEntity);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error updating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            logger.error("Error updating : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestEntity(@PathVariable Long id) {
        logger.info("Deleting  with id: {}", id);
        try {
            testentityService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Custom endpoints
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TestEntityDTO>> getByStatus(@PathVariable String status) {
        logger.info("Getting s by status: {}", status);
        List<TestEntityDTO> testentitys = testentityService.findByStatus(status);
        return ResponseEntity.ok(testentitys);
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("TestEntityController is healthy");
    }

    // Custom endpoints
}
