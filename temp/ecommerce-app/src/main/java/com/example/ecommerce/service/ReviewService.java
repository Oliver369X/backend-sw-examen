package com.example.ecommerce.service;

import com.example.ecommerce.dto.ReviewDTO;
import com.example.ecommerce.entity.Review;
import com.example.ecommerce.mapper.ReviewMapper;
import com.example.ecommerce.repository.ReviewRepository;
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
public class ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewMapper reviewMapper;

    // Basic CRUD Operations
    @Cacheable(value = "reviews", key = "'all'")
    public List<ReviewDTO> findAll() {
        logger.info("Finding all reviews");
        return reviewRepository.findAll()
                .stream()
                .map(reviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "review", key = "#id")
    public Optional<ReviewDTO> findById(Long id) {
        logger.info("Finding review with id: {}", id);
        return reviewRepository.findById(id)
                .map(reviewMapper::toDTO);
    }

    @Transactional
    @CacheEvict(value = {"reviews", "review"}, allEntries = true)
    public ReviewDTO save(ReviewDTO reviewDTO) {
        logger.info("Saving review: {}", reviewDTO);
        validateReviewDTO(reviewDTO);
        Review review = reviewMapper.toEntity(reviewDTO);
        Review savedReview = reviewRepository.save(review);
        return reviewMapper.toDTO(savedReview);
    }

    @Transactional
    @CachePut(value = "review", key = "#id")
    @CacheEvict(value = "reviews", allEntries = true)
    public ReviewDTO update(Long id, ReviewDTO reviewDTO) {
        logger.info("Updating review with id: {}", id);
        Review existingReview = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
        
        validateReviewDTO(reviewDTO);
        reviewMapper.updateEntityFromDTO(existingReview, reviewDTO);
        Review updatedReview = reviewRepository.save(existingReview);
        return reviewMapper.toDTO(updatedReview);
    }

    @Transactional
    @CacheEvict(value = {"reviews", "review"}, key = "#id")
    public void deleteById(Long id) {
        logger.info("Deleting review with id: {}", id);
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return reviewRepository.existsById(id);
    }

    // Advanced Operations
    public Page<ReviewDTO> findAllPaginated(Pageable pageable) {
        logger.info("Finding all reviews with pagination: {}", pageable);
        return reviewRepository.findAll(pageable)
                .map(reviewMapper::toDTO);
    }

    // Custom business methods
    public List<ReviewDTO> findByStatus(String status) {
        logger.info("Finding reviews by status: {}", status);
        // Implementar lógica específica según el dominio
        return reviewRepository.findAll()
                .stream()
                .map(reviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Validation Methods
    private void validateReviewDTO(ReviewDTO reviewDTO) {
        logger.debug("Validating review DTO: {}", reviewDTO);
        
        if (reviewDTO == null) {
            throw new IllegalArgumentException("Review DTO cannot be null");
        }
        
    }

    // Business Logic Methods
}
