package com.example.ecommerce.controller;

import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.service.ProductService;
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
@RequestMapping("/api/product")
@CrossOrigin(origins = "*")
@Validated
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    // Basic CRUD Operations
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        logger.info("Getting all s");
        List<ProductDTO> products = productService.findAll();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<ProductDTO>> getAllProductsPaginated(
            @PageableDefault(size = 10) Pageable pageable) {
        logger.info("Getting all s with pagination: {}", pageable);
        Page<ProductDTO> products = productService.findAllPaginated(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        logger.info("Getting  by id: {}", id);
        Optional<ProductDTO> product = productService.findById(id);
        return product.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        logger.info("Creating new : {}", productDTO);
        try {
            ProductDTO savedProduct = productService.save(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error creating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, 
                                                             @Valid @RequestBody ProductDTO productDTO) {
        logger.info("Updating  with id: {}", id);
        try {
            ProductDTO updatedProduct = productService.update(id, productDTO);
            return ResponseEntity.ok(updatedProduct);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error updating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            logger.error("Error updating : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        logger.info("Deleting  with id: {}", id);
        try {
            productService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Custom endpoints
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProductDTO>> getByStatus(@PathVariable String status) {
        logger.info("Getting s by status: {}", status);
        List<ProductDTO> products = productService.findByStatus(status);
        return ResponseEntity.ok(products);
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ProductController is healthy");
    }

    // Custom endpoints
}
