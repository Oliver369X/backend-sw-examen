package com.example.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import java.util.Objects;
import java.time.LocalDateTime;

public class ReviewDTO {
    @NotNull(message = "Rating is required")
    @Min(value = 0, message = "Rating must be greater than or equal to 0")
    @JsonProperty("rating")
    private Integer rating;
    @NotBlank(message = "Comment is required")
    @Size(max = 255, message = "Comment must not exceed 255 characters")
    @JsonProperty("comment")
    private String comment;
    @JsonProperty("reviewDate")
    private LocalDateTime reviewDate;

    // Constructors
    public ReviewDTO() {}

    public ReviewDTO(Integer rating, String comment, LocalDateTime reviewDate) {
                this.rating = rating;
        this.comment = comment;
        this.reviewDate = reviewDate;
    }

    // Getters and Setters
    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
    public LocalDateTime getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }

    // Utility Methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReviewDTO)) return false;
        ReviewDTO that = (ReviewDTO) o;
        return Objects.equals(rating, that.rating) &&
                Objects.equals(comment, that.comment) &&
                Objects.equals(reviewDate, that.reviewDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rating, comment, reviewDate);
    }

    @Override
    public String toString() {
        return "ReviewDTO{" +
                ", rating=" + rating +
                                ", comment=" + comment +
                                ", reviewDate=" + reviewDate                 +
                '}';
    }
}
