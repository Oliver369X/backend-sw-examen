package com.example.test.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import java.util.Objects;

public class TestEntityDTO {
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    @JsonProperty("name")
    private String name;

    // Constructors
    public TestEntityDTO() {}

    public TestEntityDTO(String name) {
                this.name = name;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Utility Methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TestEntityDTO)) return false;
        TestEntityDTO that = (TestEntityDTO) o;
        return Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "TestEntityDTO{" +
                "name=" + name +
                '}';
    }
}
