package com.example.ecommerce.controller;

import com.example.ecommerce.dto.CategoryDTO;
import com.example.ecommerce.service.CategoryService;
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
@RequestMapping("/api/category")
@CrossOrigin(origins = "*")
@Validated
public class CategoryController {

    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    private CategoryService categoryService;

    // Basic CRUD Operations
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategorys() {
        logger.info("Getting all s");
        List<CategoryDTO> categorys = categoryService.findAll();
        return ResponseEntity.ok(categorys);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<CategoryDTO>> getAllCategorysPaginated(
            @PageableDefault(size = 10) Pageable pageable) {
        logger.info("Getting all s with pagination: {}", pageable);
        Page<CategoryDTO> categorys = categoryService.findAllPaginated(pageable);
        return ResponseEntity.ok(categorys);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        logger.info("Getting  by id: {}", id);
        Optional<CategoryDTO> category = categoryService.findById(id);
        return category.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        logger.info("Creating new : {}", categoryDTO);
        try {
            CategoryDTO savedCategory = categoryService.save(categoryDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error creating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, 
                                                             @Valid @RequestBody CategoryDTO categoryDTO) {
        logger.info("Updating  with id: {}", id);
        try {
            CategoryDTO updatedCategory = categoryService.update(id, categoryDTO);
            return ResponseEntity.ok(updatedCategory);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error updating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            logger.error("Error updating : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        logger.info("Deleting  with id: {}", id);
        try {
            categoryService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Custom endpoints
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CategoryDTO>> getByStatus(@PathVariable String status) {
        logger.info("Getting s by status: {}", status);
        List<CategoryDTO> categorys = categoryService.findByStatus(status);
        return ResponseEntity.ok(categorys);
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("CategoryController is healthy");
    }

    // Custom endpoints
}
