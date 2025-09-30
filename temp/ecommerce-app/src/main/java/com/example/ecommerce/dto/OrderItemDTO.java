package com.example.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import java.util.Objects;
import java.time.LocalDateTime;

public class OrderItemDTO {
    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    @JsonProperty("quantity")
    private Integer quantity;
    @JsonProperty("unitPrice")
    private Double unitPrice;
    @JsonProperty("subtotal")
    private Double subtotal;

    // Constructors
    public OrderItemDTO() {}

    public OrderItemDTO(Integer quantity, Double unitPrice, Double subtotal) {
                this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotal = subtotal;
    }

    // Getters and Setters
    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }
    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    // Utility Methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderItemDTO)) return false;
        OrderItemDTO that = (OrderItemDTO) o;
        return Objects.equals(quantity, that.quantity) &&
                Objects.equals(unitPrice, that.unitPrice) &&
                Objects.equals(subtotal, that.subtotal);
    }

    @Override
    public int hashCode() {
        return Objects.hash(quantity, unitPrice, subtotal);
    }

    @Override
    public String toString() {
        return "OrderItemDTO{" +
                ", quantity=" + quantity +
                                ", unitPrice=" + unitPrice +
                                ", subtotal=" + subtotal                 +
                '}';
    }
}
