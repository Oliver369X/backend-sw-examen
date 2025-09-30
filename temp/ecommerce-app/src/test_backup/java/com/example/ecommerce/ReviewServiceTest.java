package com.example.ecommerce;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private ReviewMapper Mapper;

    @InjectMocks
    private ReviewService reviewService;

    private Review review;
    private ReviewDTO reviewDTO;

    @BeforeEach
    void setUp() {
        review = new Review();
        review.setRating(1);
        review.setComment("Test comment");
        
        reviewDTO = new ReviewDTO();
        reviewDTO.setRating(1);
        reviewDTO.setComment("Test comment");
    }

    @Test
    void testFindAll() {
        // Given
        List<Review> reviews = List.of(review);
        List<ReviewDTO> reviewsDTO = List.of(reviewDTO);
        when(reviewRepository.findAll()).thenReturn(reviews);
        when(Mapper.toDTO(review)).thenReturn(reviewDTO);

        // When
        List<ReviewDTO> result = reviewService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(reviewRepository).findAll();
        verify(Mapper).toDTO(review);
    }

    @Test
    void testFindById() {
        // Given
        Long id = 1L;
        when(reviewRepository.findById(id)).thenReturn(Optional.of(review));
        when(Mapper.toDTO(review)).thenReturn(reviewDTO);

        // When
        Optional<ReviewDTO> result = reviewService.findById(id);

        // Then
        assertTrue(result.isPresent());
        assertEquals(reviewDTO, result.get());
        verify(reviewRepository).findById(id);
        verify(Mapper).toDTO(review);
    }

    @Test
    void testFindByIdNotFound() {
        // Given
        Long id = 1L;
        when(reviewRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Optional<ReviewDTO> result = reviewService.findById(id);

        // Then
        assertFalse(result.isPresent());
        verify(reviewRepository).findById(id);
    }

    @Test
    void testSave() {
        // Given
        when(Mapper.toEntity(reviewDTO)).thenReturn(review);
        when(reviewRepository.save(review)).thenReturn(review);
        when(Mapper.toDTO(review)).thenReturn(reviewDTO);

        // When
        ReviewDTO result = reviewService.save(reviewDTO);

        // Then
        assertNotNull(result);
        assertEquals(reviewDTO, result);
        verify(Mapper).toEntity(reviewDTO);
        verify(reviewRepository).save(review);
        verify(Mapper).toDTO(review);
    }

    @Test
    void testUpdate() {
        // Given
        Long id = 1L;
        review.setId(id);
        when(reviewRepository.existsById(id)).thenReturn(true);
        when(Mapper.toEntity(reviewDTO)).thenReturn(review);
        when(reviewRepository.save(review)).thenReturn(review);
        when(Mapper.toDTO(review)).thenReturn(reviewDTO);

        // When
        ReviewDTO result = reviewService.update(id, reviewDTO);

        // Then
        assertNotNull(result);
        assertEquals(reviewDTO, result);
        verify(reviewRepository).existsById(id);
        verify(Mapper).toEntity(reviewDTO);
        verify(reviewRepository).save(review);
        verify(Mapper).toDTO(review);
    }

    @Test
    void testUpdateNotFound() {
        // Given
        Long id = 1L;
        when(reviewRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            reviewService.update(id, reviewDTO);
        });
        verify(reviewRepository).existsById(id);
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void testDeleteById() {
        // Given
        Long id = 1L;
        when(reviewRepository.existsById(id)).thenReturn(true);

        // When
        reviewService.deleteById(id);

        // Then
        verify(reviewRepository).existsById(id);
        verify(reviewRepository).deleteById(id);
    }

    @Test
    void testDeleteByIdNotFound() {
        // Given
        Long id = 1L;
        when(reviewRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            reviewService.deleteById(id);
        });
        verify(reviewRepository).existsById(id);
        verify(reviewRepository, never()).deleteById(id);
    }

    @Test
    void testExistsById() {
        // Given
        Long id = 1L;
        when(reviewRepository.existsById(id)).thenReturn(true);

        // When
        boolean result = reviewService.existsById(id);

        // Then
        assertTrue(result);
        verify(reviewRepository).existsById(id);
    }

    @Test
    void testFindAllPaginated() {
        // Given
        Pageable pageable = Pageable.ofSize(10);
        Page<Review> page = new PageImpl<>(List.of(review));
        when(reviewRepository.findAll(pageable)).thenReturn(page);
        when(Mapper.toDTO(review)).thenReturn(reviewDTO);

        // When
        Page<ReviewDTO> result = reviewService.findAllPaginated(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(reviewRepository).findAll(pageable);
        verify(Mapper).toDTO(review);
    }




    @Test
    void testValidation() {
        // Given
        ReviewDTO invalidReviewDTO = new ReviewDTO();
        // Leave required fields empty to test validation

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            reviewService.save(invalidReviewDTO);
        });
    }
}



