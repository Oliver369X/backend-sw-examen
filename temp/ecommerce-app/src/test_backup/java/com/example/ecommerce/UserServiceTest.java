package com.example.ecommerce;

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

    @Mock
    private UserMapper Mapper;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserDTO userDTO;

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
        
        userDTO = new UserDTO();
        userDTO.setEmail("Test email");
        userDTO.setUsername("Test username");
        userDTO.setPassword("Test password");
        userDTO.setFirstName("Test firstName");
        userDTO.setLastName("Test lastName");
        userDTO.setPhone("Test phone");
        userDTO.setActive(true);
    }

    @Test
    void testFindAll() {
        // Given
        List<User> users = List.of(user);
        List<UserDTO> usersDTO = List.of(userDTO);
        when(userRepository.findAll()).thenReturn(users);
        when(Mapper.toDTO(user)).thenReturn(userDTO);

        // When
        List<UserDTO> result = userService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userRepository).findAll();
        verify(Mapper).toDTO(user);
    }

    @Test
    void testFindById() {
        // Given
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(Mapper.toDTO(user)).thenReturn(userDTO);

        // When
        Optional<UserDTO> result = userService.findById(id);

        // Then
        assertTrue(result.isPresent());
        assertEquals(userDTO, result.get());
        verify(userRepository).findById(id);
        verify(Mapper).toDTO(user);
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
    }

    @Test
    void testSave() {
        // Given
        when(Mapper.toEntity(userDTO)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(Mapper.toDTO(user)).thenReturn(userDTO);

        // When
        UserDTO result = userService.save(userDTO);

        // Then
        assertNotNull(result);
        assertEquals(userDTO, result);
        verify(Mapper).toEntity(userDTO);
        verify(userRepository).save(user);
        verify(Mapper).toDTO(user);
    }

    @Test
    void testUpdate() {
        // Given
        Long id = 1L;
        user.setId(id);
        when(userRepository.existsById(id)).thenReturn(true);
        when(Mapper.toEntity(userDTO)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(Mapper.toDTO(user)).thenReturn(userDTO);

        // When
        UserDTO result = userService.update(id, userDTO);

        // Then
        assertNotNull(result);
        assertEquals(userDTO, result);
        verify(userRepository).existsById(id);
        verify(Mapper).toEntity(userDTO);
        verify(userRepository).save(user);
        verify(Mapper).toDTO(user);
    }

    @Test
    void testUpdateNotFound() {
        // Given
        Long id = 1L;
        when(userRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            userService.update(id, userDTO);
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
        when(Mapper.toDTO(user)).thenReturn(userDTO);

        // When
        Page<UserDTO> result = userService.findAllPaginated(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(userRepository).findAll(pageable);
        verify(Mapper).toDTO(user);
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
        UserDTO invalidUserDTO = new UserDTO();
        // Leave required fields empty to test validation

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            userService.save(invalidUserDTO);
        });
    }
}



