package com.example.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.*;
import java.util.Objects;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    @NotNull
    @NotBlank
    
    private String orderNumber;
    @Column(nullable = false)
    @NotNull
    
    
    private LocalDateTime orderDate;
    @Column(nullable = false)
    @NotNull
    @NotBlank
    
    private String status;
    @Column(nullable = false)
    @NotNull
    
    
    private Double total;
    @Column(nullable = false)
    @NotNull
    @NotBlank
    
    private String shippingAddress;

    // Constructors
    public Order() {}

    public Order(String orderNumber, LocalDateTime orderDate, String status, Double total, String shippingAddress) {
                this.orderNumber = orderNumber;
        this.orderDate = orderDate;
        this.status = status;
        this.total = total;
        this.shippingAddress = shippingAddress;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
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

    // Business Methods
    public boolean isValid() {
        return true;
    }

    // Utility Methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Order)) return false;
        Order that = (Order) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                                ", orderNumber=" + orderNumber +
                                ", orderDate=" + orderDate +
                                ", status=" + status +
                                ", total=" + total +
                                ", shippingAddress=" + shippingAddress +
                '}';
    }
}
