package com.example.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import java.util.Objects;
import java.time.LocalDateTime;

public class UserDTO {
    @NotBlank(message = "Email is required")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @JsonProperty("email")
    private String email;
    @NotBlank(message = "Username is required")
    @Size(max = 255, message = "Username must not exceed 255 characters")
    @JsonProperty("username")
    private String username;
    @NotBlank(message = "Password is required")
    @Size(max = 255, message = "Password must not exceed 255 characters")
    @JsonProperty("password")
    private String password;
    @NotBlank(message = "FirstName is required")
    @Size(max = 255, message = "FirstName must not exceed 255 characters")
    @JsonProperty("firstName")
    private String firstName;
    @NotBlank(message = "LastName is required")
    @Size(max = 255, message = "LastName must not exceed 255 characters")
    @JsonProperty("lastName")
    private String lastName;
    @NotBlank(message = "Phone is required")
    @Size(max = 255, message = "Phone must not exceed 255 characters")
    @JsonProperty("phone")
    private String phone;
    @NotNull(message = "Active is required")
    @JsonProperty("active")
    private Boolean active;

    // Constructors
    public UserDTO() {}

    public UserDTO(String email, String username, String password, String firstName, String lastName, String phone, Boolean active) {
                this.email = email;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.active = active;
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

    // Utility Methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserDTO)) return false;
        UserDTO that = (UserDTO) o;
        return Objects.equals(email, that.email) &&
                Objects.equals(username, that.username) &&
                Objects.equals(password, that.password) &&
                Objects.equals(firstName, that.firstName) &&
                Objects.equals(lastName, that.lastName) &&
                Objects.equals(phone, that.phone) &&
                Objects.equals(active, that.active);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email, username, password, firstName, lastName, phone, active);
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                ", email=" + email +
                                ", username=" + username +
                                ", password=" + password +
                                ", firstName=" + firstName +
                                ", lastName=" + lastName +
                                ", phone=" + phone +
                                ", active=" + active                 +
                '}';
    }
}
