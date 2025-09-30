package com.example.ecommerce;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ReviewTest {

    @Autowired
    private ReviewRepository reviewRepository;

    private Review review;

    @BeforeEach
    void setUp() {
        review = new Review();
        review.setRating(1);
        review.setComment("Test comment");
    }

    @Test
    void testSaveReview() {
        // Given
        Review savedReview = reviewRepository.save(review);

        // Then
        assertNotNull(savedReview);
        assertNotNull(savedReview.getId());
        assertEquals(1, saved.getRating());
        assertEquals("Test comment", saved.getComment());
    }

    @Test
    void testFindById() {
        // Given
        Review savedReview = reviewRepository.save(review);

        // When
        Optional<Review> foundReview = reviewRepository.findById(savedReview.getId());

        // Then
        assertTrue(foundReview.isPresent());
        assertEquals(savedReview.getId(), foundReview.get().getId());
    }

    @Test
    void testUpdateReview() {
        // Given
        Review savedReview = reviewRepository.save(review);
        saved.setRating(999);
                saved.setComment("Updated comment");

        // When
        Review updatedReview = reviewRepository.save(savedReview);

        // Then
        assertEquals(999, updated.getRating());
                assertEquals("Updated comment", updated.getComment());
    }

    @Test
    void testDeleteReview() {
        // Given
        Review savedReview = reviewRepository.save(review);
        Long id = savedReview.getId();

        // When
        reviewRepository.deleteById(id);

        // Then
        assertFalse(reviewRepository.existsById(id));
    }




    @Test
    void testEqualsAndHashCode() {
        // Given
        Review review1 = new Review();
        Review review2 = new Review();

        review1.setComment("Test comment");
        review2.setComment("Test comment");

        // When
        Review savedReview1 = reviewRepository.save(review1);
        Review savedReview2 = reviewRepository.save(review2);

        // Then
        assertNotEquals(savedReview1, savedReview2);
        assertNotEquals(savedReview1.hashCode(), savedReview2.hashCode());

        // Test with same ID
        savedReview2.setId(savedReview1.getId());
        assertEquals(savedReview1, savedReview2);
        assertEquals(savedReview1.hashCode(), savedReview2.hashCode());
    }
}



