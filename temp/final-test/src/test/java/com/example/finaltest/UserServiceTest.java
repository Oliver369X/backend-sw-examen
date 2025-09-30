package com.example.finaltest;

import com.example.finaltest.dto.UserDTO;
import com.example.finaltest.entity.User;
import com.example.finaltest.mapper.UserMapper;
import com.example.finaltest.repository.UserRepository;
import com.example.finaltest.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setEmail("test@example.com");
        user.setUsername("testuser");

        userDTO = new UserDTO();
        userDTO.setEmail("test@example.com");
        userDTO.setUsername("testuser");
    }

    @Test
    void testFindAll() {
        // Given
        List<User> users = List.of(user);
        when(userRepository.findAll()).thenReturn(users);
        when(userMapper.toDTO(any(User.class))).thenReturn(userDTO);

        // When
        List<UserDTO> result = userService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userRepository).findAll();
        verify(userMapper).toDTO(user);
    }

    @Test
    void testFindById() {
        // Given
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(userMapper.toDTO(user)).thenReturn(userDTO);

        // When
        Optional<UserDTO> result = userService.findById(id);

        // Then
        assertTrue(result.isPresent());
        assertEquals(userDTO, result.get());
        verify(userRepository).findById(id);
        verify(userMapper).toDTO(user);
    }

    @Test
    void testFindByIdNotFound() {
        // Given
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Optional<UserDTO> result = userService.findById(id);

        // Then
        assertFalse(result.isPresent());
        verify(userRepository).findById(id);
        verify(userMapper, never()).toDTO(any(User.class));
    }

    @Test
    void testSave() {
        // Given
        when(userMapper.toEntity(userDTO)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toDTO(user)).thenReturn(userDTO);

        // When
        UserDTO result = userService.save(userDTO);

        // Then
        assertNotNull(result);
        assertEquals(userDTO, result);
        verify(userMapper).toEntity(userDTO);
        verify(userRepository).save(user);
        verify(userMapper).toDTO(user);
    }

    @Test
    void testUpdate() {
        // Given
        Long id = 1L;
        user.setId(id);
        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toDTO(user)).thenReturn(userDTO);

        // When
        UserDTO result = userService.update(id, userDTO);

        // Then
        assertNotNull(result);
        assertEquals(userDTO, result);
        verify(userRepository).findById(id);
        verify(userMapper).updateEntityFromDTO(user, userDTO);
        verify(userRepository).save(user);
        verify(userMapper).toDTO(user);
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
        assertThrows(RuntimeException.class, () -> userService.deleteById(id));
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
}