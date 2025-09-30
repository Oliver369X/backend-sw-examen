package com.example.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.*;
import java.util.Objects;
import java.util.ArrayList;
import java.util.List;

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
    @Column(nullable = false)
    @NotNull
    @NotBlank
    
    private String password;
    @Column(nullable = false)
    @NotNull
    @NotBlank
    
    private String firstName;
    @Column(nullable = false)
    @NotNull
    @NotBlank
    
    private String lastName;
    @Column()
    
    @NotBlank
    
    private String phone;
    @Column(nullable = false)
    @NotNull
    
    
    private Boolean active;

    // Constructors
    public User() {}

    public User(String email, String username, String password, String firstName, String lastName, String phone, Boolean active) {
                this.email = email;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.active = active;
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
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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
                                ", email=" + email +
                                ", username=" + username +
                                ", password=" + password +
                                ", firstName=" + firstName +
                                ", lastName=" + lastName +
                                ", phone=" + phone +
                                ", active=" + active +
                '}';
    }
}
