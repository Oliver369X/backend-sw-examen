package com.example.ecommerce;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
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
        user.setEmail("Test email");
        user.setUsername("Test username");
        user.setPassword("Test password");
        user.setFirstName("Test firstName");
        user.setLastName("Test lastName");
        user.setPhone("Test phone");
        user.setActive(true);
    }

    @Test
    void testSaveUser() {
        // Given
        User savedUser = userRepository.save(user);

        // Then
        assertNotNull(savedUser);
        assertNotNull(savedUser.getId());
        assertEquals("Test email", saved.getEmail());
        assertEquals("Test username", saved.getUsername());
        assertEquals("Test password", saved.getPassword());
        assertEquals("Test firstName", saved.getFirstName());
        assertEquals("Test lastName", saved.getLastName());
        assertEquals("Test phone", saved.getPhone());
        assertTrue(saved.getActive());
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
        saved.setEmail("Updated email");
        saved.setUsername("Updated username");
        saved.setPassword("Updated password");
        saved.setFirstName("Updated firstName");
        saved.setLastName("Updated lastName");
        saved.setPhone("Updated phone");

        // When
        User updatedUser = userRepository.save(savedUser);

        // Then
        assertEquals("Updated email", updated.getEmail());
        assertEquals("Updated username", updated.getUsername());
        assertEquals("Updated password", updated.getPassword());
        assertEquals("Updated firstName", updated.getFirstName());
        assertEquals("Updated lastName", updated.getLastName());
        assertEquals("Updated phone", updated.getPhone());
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

        // Test activation
        savedUser.activate();
        assertTrue(savedUser.isActive());

        // Test deactivation
        savedUser.deactivate();
        assertFalse(savedUser.isActive());

        // Test full name
        String fullName = savedUser.getFullName();
        assertNotNull(fullName);
    }



    @Test
    void testEqualsAndHashCode() {
        // Given
        User user1 = new User();
        User user2 = new User();

        user1.setEmail("Test email");
        user2.setEmail("Test email");
        user1.setUsername("Test username");
        user2.setUsername("Test username");
        user1.setPassword("Test password");
        user2.setPassword("Test password");
        user1.setFirstName("Test firstName");
        user2.setFirstName("Test firstName");
        user1.setLastName("Test lastName");
        user2.setLastName("Test lastName");
        user1.setPhone("Test phone");
        user2.setPhone("Test phone");

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



