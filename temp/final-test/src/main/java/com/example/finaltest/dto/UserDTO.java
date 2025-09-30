package com.example.finaltest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import java.util.Objects;

public class UserDTO {
    @NotBlank(message = "Email is required")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @JsonProperty("email")
    private String email;
    @NotBlank(message = "Username is required")
    @Size(max = 255, message = "Username must not exceed 255 characters")
    @JsonProperty("username")
    private String username;

    // Constructors
    public UserDTO() {}

    public UserDTO(String email, String username) {
        this.email = email;
        this.username = username;
    }

    // Getters and Setters
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

    // Utility Methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserDTO)) return false;
        UserDTO that = (UserDTO) o;
        return Objects.equals(email, that.email) && 
               Objects.equals(username, that.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email, username);
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "email='" + email + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
}