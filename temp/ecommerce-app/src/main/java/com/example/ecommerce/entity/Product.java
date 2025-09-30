package com.example.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.*;
import java.util.Objects;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    @NotNull
    @NotBlank
    
    private String name;
    @Column()
    
    @NotBlank
    
    private String description;
    @Column(nullable = false)
    @NotNull
    
    
    private Double price;
    @Column(nullable = false)
    @NotNull
    
    
    private Integer stock;
    @Column(nullable = false)
    @NotNull
    @NotBlank
    
    private String sku;
    @Column(nullable = false)
    @NotNull
    
    
    private Boolean active;

    // Constructors
    public Product() {}

    public Product(String name, String description, Double price, Integer stock, String sku, Boolean active) {
                this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.sku = sku;
        this.active = active;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
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

    // Business Methods
    public boolean isValid() {
        return true;
    }

    // Utility Methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Product)) return false;
        Product that = (Product) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                                ", name=" + name +
                                ", description=" + description +
                                ", price=" + price +
                                ", stock=" + stock +
                                ", sku=" + sku +
                                ", active=" + active +
                '}';
    }
}
