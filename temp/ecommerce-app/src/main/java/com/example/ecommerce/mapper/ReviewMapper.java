package com.example.ecommerce.mapper;

import com.example.ecommerce.entity.Review;
import com.example.ecommerce.dto.ReviewDTO;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    /**
     * Convierte Entity a DTO
     */
    public ReviewDTO toDTO(Review entity) {
        if (entity == null) {
            return null;
        }

        ReviewDTO dto = new ReviewDTO();
        dto.setRating(entity.getRating());
        dto.setComment(entity.getComment());
        dto.setReviewDate(entity.getReviewDate());
        
        return dto;
    }

    /**
     * Convierte DTO a Entity
     */
    public Review toEntity(ReviewDTO dto) {
        if (dto == null) {
            return null;
        }

        Review entity = new Review();
        entity.setRating(dto.getRating());
        entity.setComment(dto.getComment());
        entity.setReviewDate(dto.getReviewDate());
        
        return entity;
    }

    /**
     * Actualiza Entity con datos del DTO
     */
    public void updateEntityFromDTO(Review entity, ReviewDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setRating(dto.getRating());
        entity.setComment(dto.getComment());
        entity.setReviewDate(dto.getReviewDate());
    }
}



