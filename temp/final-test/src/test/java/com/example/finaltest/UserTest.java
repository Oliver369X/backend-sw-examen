package com.example.finaltest;

import com.example.finaltest.entity.User;
import com.example.finaltest.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class UserTest {

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setEmail("test@example.com");
        user.setUsername("testuser");
    }

    @Test
    void testSaveUser() {
        // Given
        User savedUser = userRepository.save(user);

        // Then
        assertNotNull(savedUser);
        assertNotNull(savedUser.getId());
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals("testuser", savedUser.getUsername());
    }

    @Test
    void testFindById() {
        // Given
        User savedUser = userRepository.save(user);

        // When
        Optional<User> foundUser = userRepository.findById(savedUser.getId());

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals(savedUser.getId(), foundUser.get().getId());
    }

    @Test
    void testUpdateUser() {
        // Given
        User savedUser = userRepository.save(user);
        savedUser.setEmail("updated@example.com");
        savedUser.setUsername("updateduser");

        // When
        User updatedUser = userRepository.save(savedUser);

        // Then
        assertEquals("updated@example.com", updatedUser.getEmail());
        assertEquals("updateduser", updatedUser.getUsername());
    }

    @Test
    void testDeleteUser() {
        // Given
        User savedUser = userRepository.save(user);
        Long id = savedUser.getId();

        // When
        userRepository.deleteById(id);

        // Then
        assertFalse(userRepository.existsById(id));
    }

    @Test
    void testUserBusinessMethods() {
        // Given
        User savedUser = userRepository.save(user);

        // Test validation
        assertTrue(savedUser.isValid());
    }

    @Test
    void testEqualsAndHashCode() {
        // Given
        User user1 = new User();
        User user2 = new User();

        user1.setEmail("test1@example.com");
        user2.setEmail("test2@example.com");
        user1.setUsername("testuser1");
        user2.setUsername("testuser2");

        // When
        User savedUser1 = userRepository.save(user1);
        User savedUser2 = userRepository.save(user2);

        // Then
        assertNotEquals(savedUser1, savedUser2);
        assertNotEquals(savedUser1.hashCode(), savedUser2.hashCode());

        // Test with same ID
        savedUser2.setId(savedUser1.getId());
        assertEquals(savedUser1, savedUser2);
        assertEquals(savedUser1.hashCode(), savedUser2.hashCode());
    }
}