package com.example.test.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.*;
import java.util.Objects;

@Entity
@Table(name = "test_entity")
public class TestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    @NotNull
    @NotBlank
    
    private String name;

    // Constructors
    public TestEntity() {}

    public TestEntity(String name) {
                this.name = name;
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

    // Business Methods
    public boolean isValid() {
        return true;
    }

    // Utility Methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TestEntity)) return false;
        TestEntity that = (TestEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TestEntity{" +
                "id=" + id +
                ", name=" + name +
                '}';
    }
}
