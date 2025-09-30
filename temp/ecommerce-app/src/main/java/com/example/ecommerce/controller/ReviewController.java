package com.example.ecommerce.controller;

import com.example.ecommerce.dto.ReviewDTO;
import com.example.ecommerce.service.ReviewService;
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
@RequestMapping("/api/review")
@CrossOrigin(origins = "*")
@Validated
public class ReviewController {

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    @Autowired
    private ReviewService reviewService;

    // Basic CRUD Operations
    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        logger.info("Getting all s");
        List<ReviewDTO> reviews = reviewService.findAll();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<ReviewDTO>> getAllReviewsPaginated(
            @PageableDefault(size = 10) Pageable pageable) {
        logger.info("Getting all s with pagination: {}", pageable);
        Page<ReviewDTO> reviews = reviewService.findAllPaginated(pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long id) {
        logger.info("Getting  by id: {}", id);
        Optional<ReviewDTO> review = reviewService.findById(id);
        return review.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@Valid @RequestBody ReviewDTO reviewDTO) {
        logger.info("Creating new : {}", reviewDTO);
        try {
            ReviewDTO savedReview = reviewService.save(reviewDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error creating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewDTO> updateReview(@PathVariable Long id, 
                                                             @Valid @RequestBody ReviewDTO reviewDTO) {
        logger.info("Updating  with id: {}", id);
        try {
            ReviewDTO updatedReview = reviewService.update(id, reviewDTO);
            return ResponseEntity.ok(updatedReview);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error updating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            logger.error("Error updating : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        logger.info("Deleting  with id: {}", id);
        try {
            reviewService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Custom endpoints
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ReviewDTO>> getByStatus(@PathVariable String status) {
        logger.info("Getting s by status: {}", status);
        List<ReviewDTO> reviews = reviewService.findByStatus(status);
        return ResponseEntity.ok(reviews);
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ReviewController is healthy");
    }

    // Custom endpoints
}
