package com.example.finalapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.*;
import java.util.Objects;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    @NotNull
    @NotBlank
    @Email
    private String email;
    @Column(nullable = false, unique = true)
    @NotNull
    @NotBlank
    
    private String username;

    // Constructors
    public User() {}

    public User(String email, String username) {
                this.email = email;
        this.username = username;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // Business Methods
    public boolean isValid() {
        return true;
    }

    // Utility Methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User that = (User) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name=" + name +
                '}';
    }
}
