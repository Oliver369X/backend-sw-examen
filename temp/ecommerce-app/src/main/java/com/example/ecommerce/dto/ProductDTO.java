package com.example.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import java.util.Objects;
import java.time.LocalDateTime;

public class ProductDTO {
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    @JsonProperty("name")
    private String name;
    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description must not exceed 255 characters")
    @JsonProperty("description")
    private String description;
    @JsonProperty("price")
    private Double price;
    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock must be greater than or equal to 0")
    @JsonProperty("stock")
    private Integer stock;
    @NotBlank(message = "Sku is required")
    @Size(max = 255, message = "Sku must not exceed 255 characters")
    @JsonProperty("sku")
    private String sku;
    @NotNull(message = "Active is required")
    @JsonProperty("active")
    private Boolean active;

    // Constructors
    public ProductDTO() {}

    public ProductDTO(String name, String description, Double price, Integer stock, String sku, Boolean active) {
                this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.sku = sku;
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
    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
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
        if (!(o instanceof ProductDTO)) return false;
        ProductDTO that = (ProductDTO) o;
        return Objects.equals(name, that.name) &&
                Objects.equals(description, that.description) &&
                Objects.equals(price, that.price) &&
                Objects.equals(stock, that.stock) &&
                Objects.equals(sku, that.sku) &&
                Objects.equals(active, that.active);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, description, price, stock, sku, active);
    }

    @Override
    public String toString() {
        return "ProductDTO{" +
                ", name=" + name +
                                ", description=" + description +
                                ", price=" + price +
                                ", stock=" + stock +
                                ", sku=" + sku +
                                ", active=" + active                 +
                '}';
    }
}
