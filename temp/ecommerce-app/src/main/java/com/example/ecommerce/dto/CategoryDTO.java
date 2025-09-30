package com.example.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import java.util.Objects;
import java.time.LocalDateTime;

public class CategoryDTO {
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    @JsonProperty("name")
    private String name;
    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description must not exceed 255 characters")
    @JsonProperty("description")
    private String description;
    @NotNull(message = "Active is required")
    @JsonProperty("active")
    private Boolean active;

    // Constructors
    public CategoryDTO() {}

    public CategoryDTO(String name, String description, Boolean active) {
                this.name = name;
        this.description = description;
        this.active = active;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    // Utility Methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CategoryDTO)) return false;
        CategoryDTO that = (CategoryDTO) o;
        return Objects.equals(name, that.name) &&
                Objects.equals(description, that.description) &&
                Objects.equals(active, that.active);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, description, active);
    }

    @Override
    public String toString() {
        return "CategoryDTO{" +
                ", name=" + name +
                                ", description=" + description +
                                ", active=" + active                 +
                '}';
    }
}
