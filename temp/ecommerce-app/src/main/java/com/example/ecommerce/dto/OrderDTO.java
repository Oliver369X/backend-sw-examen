package com.example.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import java.util.Objects;
import java.time.LocalDateTime;

public class OrderDTO {
    @NotBlank(message = "OrderNumber is required")
    @Size(max = 255, message = "OrderNumber must not exceed 255 characters")
    @JsonProperty("orderNumber")
    private String orderNumber;
    @JsonProperty("orderDate")
    private LocalDateTime orderDate;
    @NotBlank(message = "Status is required")
    @Size(max = 255, message = "Status must not exceed 255 characters")
    @JsonProperty("status")
    private String status;
    @JsonProperty("total")
    private Double total;
    @NotBlank(message = "ShippingAddress is required")
    @Size(max = 255, message = "ShippingAddress must not exceed 255 characters")
    @JsonProperty("shippingAddress")
    private String shippingAddress;

    // Constructors
    public OrderDTO() {}

    public OrderDTO(String orderNumber, LocalDateTime orderDate, String status, Double total, String shippingAddress) {
                this.orderNumber = orderNumber;
        this.orderDate = orderDate;
        this.status = status;
        this.total = total;
        this.shippingAddress = shippingAddress;
    }

    // Getters and Setters
    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }
    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    // Utility Methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderDTO)) return false;
        OrderDTO that = (OrderDTO) o;
        return Objects.equals(orderNumber, that.orderNumber) &&
                Objects.equals(orderDate, that.orderDate) &&
                Objects.equals(status, that.status) &&
                Objects.equals(total, that.total) &&
                Objects.equals(shippingAddress, that.shippingAddress);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderNumber, orderDate, status, total, shippingAddress);
    }

    @Override
    public String toString() {
        return "OrderDTO{" +
                ", orderNumber=" + orderNumber +
                                ", orderDate=" + orderDate +
                                ", status=" + status +
                                ", total=" + total +
                                ", shippingAddress=" + shippingAddress                 +
                '}';
    }
}
