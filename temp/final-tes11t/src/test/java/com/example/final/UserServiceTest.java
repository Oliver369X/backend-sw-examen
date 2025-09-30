package com.example.final;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        .setEmail("Test email");
        .setUsername("Test username");
    }

    @Test
    void testFindAll() {
        // Given
        List<User> users = List.of(user);
        when(userRepository.findAll()).thenReturn(users);

        // When
        List<User> result = userService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void testFindById() {
        // Given
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        // When
        Optional<User> result = userService.findById(id);

        // Then
        assertTrue(result.isPresent());
        assertEquals(user, result.get());
        verify(userRepository).findById(id);
    }

    @Test
    void testFindByIdNotFound() {
        // Given
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.findById(id);

        // Then
        assertFalse(result.isPresent());
        verify(userRepository).findById(id);
    }

    @Test
    void testSave() {
        // Given
        when(userRepository.save(user)).thenReturn(user);

        // When
        User result = userService.save(user);

        // Then
        assertNotNull(result);
        assertEquals(user, result);
        verify(userRepository).save(user);
    }

    @Test
    void testUpdate() {
        // Given
        Long id = 1L;
        user.setId(id);
        when(userRepository.existsById(id)).thenReturn(true);
        when(userRepository.save(user)).thenReturn(user);

        // When
        User result = userService.update(id, user);

        // Then
        assertNotNull(result);
        assertEquals(id, result.getId());
        verify(userRepository).existsById(id);
        verify(userRepository).save(user);
    }

    @Test
    void testUpdateNotFound() {
        // Given
        Long id = 1L;
        when(userRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            userService.update(id, user);
        });
        verify(userRepository).existsById(id);
        verify(userRepository, never()).save(any());
    }

    @Test
    void testDeleteById() {
        // Given
        Long id = 1L;
        when(userRepository.existsById(id)).thenReturn(true);

        // When
        userService.deleteById(id);

        // Then
        verify(userRepository).existsById(id);
        verify(userRepository).deleteById(id);
    }

    @Test
    void testDeleteByIdNotFound() {
        // Given
        Long id = 1L;
        when(userRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            userService.deleteById(id);
        });
        verify(userRepository).existsById(id);
        verify(userRepository, never()).deleteById(id);
    }

    @Test
    void testExistsById() {
        // Given
        Long id = 1L;
        when(userRepository.existsById(id)).thenReturn(true);

        // When
        boolean result = userService.existsById(id);

        // Then
        assertTrue(result);
        verify(userRepository).existsById(id);
    }

    @Test
    void testFindAllPaginated() {
        // Given
        Pageable pageable = Pageable.ofSize(10);
        Page<User> page = new PageImpl<>(List.of(user));
        when(userRepository.findAll(pageable)).thenReturn(page);

        // When
        Page<User> result = userService.findAllPaginated(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(userRepository).findAll(pageable);
    }

    @Test
    void testFindByEmail() {
        // Given
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // When
        Optional<User> result = userService.findByEmail(email);

        // Then
        assertTrue(result.isPresent());
        assertEquals(user, result.get());
        verify(userRepository).findByEmail(email);
    }

    @Test
    void testExistsByEmail() {
        // Given
        String email = "test@example.com";
        when(userRepository.existsByEmail(email)).thenReturn(true);

        // When
        boolean result = userService.existsByEmail(email);

        // Then
        assertTrue(result);
        verify(userRepository).existsByEmail(email);
    }

    @Test
    void testActivateUser() {
        // Given
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        // When
        User result = userService.activateUser(id);

        // Then
        assertNotNull(result);
        verify(userRepository).findById(id);
        verify(userRepository).save(user);
    }

    @Test
    void testDeactivateUser() {
        // Given
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        // When
        User result = userService.deactivateUser(id);

        // Then
        assertNotNull(result);
        verify(userRepository).findById(id);
        verify(userRepository).save(user);
    }



    @Test
    void testValidation() {
        // Given
        User invalidUser = new User();
        // Leave required fields empty to test validation

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            userService.save(invalidUser);
        });
    }
}



