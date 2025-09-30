package com.example.test;

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
public class TestEntityServiceTest {

    @Mock
    private TestEntityRepository testEntityRepository;

    @Mock
    private TestEntityMapper Mapper;

    @InjectMocks
    private TestEntityService testEntityService;

    private TestEntity testEntity;
    private TestEntityDTO testEntityDTO;

    @BeforeEach
    void setUp() {
        testEntity = new TestEntity();
        testEntityDTO = new TestEntityDTO();
        .setName("Test name");
        DTO.setName("Test name");
    }

    @Test
    void testFindAll() {
        // Given
        List<TestEntity> testentitys = List.of(testEntity);
        List<TestEntityDTO> testentitysDTO = List.of(testEntityDTO);
        when(testEntityRepository.findAll()).thenReturn(testentitys);
        when(Mapper.toDTO(testEntity)).thenReturn(testEntityDTO);

        // When
        List<TestEntityDTO> result = testEntityService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(testEntityRepository).findAll();
        verify(Mapper).toDTO(testEntity);
    }

    @Test
    void testFindById() {
        // Given
        Long id = 1L;
        when(testEntityRepository.findById(id)).thenReturn(Optional.of(testEntity));
        when(Mapper.toDTO(testEntity)).thenReturn(testEntityDTO);

        // When
        Optional<TestEntityDTO> result = testEntityService.findById(id);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testEntityDTO, result.get());
        verify(testEntityRepository).findById(id);
        verify(Mapper).toDTO(testEntity);
    }

    @Test
    void testFindByIdNotFound() {
        // Given
        Long id = 1L;
        when(testEntityRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Optional<TestEntityDTO> result = testEntityService.findById(id);

        // Then
        assertFalse(result.isPresent());
        verify(testEntityRepository).findById(id);
    }

    @Test
    void testSave() {
        // Given
        when(Mapper.toEntity(testEntityDTO)).thenReturn(testEntity);
        when(testEntityRepository.save(testEntity)).thenReturn(testEntity);
        when(Mapper.toDTO(testEntity)).thenReturn(testEntityDTO);

        // When
        TestEntityDTO result = testEntityService.save(testEntityDTO);

        // Then
        assertNotNull(result);
        assertEquals(testEntityDTO, result);
        verify(Mapper).toEntity(testEntityDTO);
        verify(testEntityRepository).save(testEntity);
        verify(Mapper).toDTO(testEntity);
    }

    @Test
    void testUpdate() {
        // Given
        Long id = 1L;
        testEntity.setId(id);
        when(testEntityRepository.existsById(id)).thenReturn(true);
        when(Mapper.toEntity(testEntityDTO)).thenReturn(testEntity);
        when(testEntityRepository.save(testEntity)).thenReturn(testEntity);
        when(Mapper.toDTO(testEntity)).thenReturn(testEntityDTO);

        // When
        TestEntityDTO result = testEntityService.update(id, testEntityDTO);

        // Then
        assertNotNull(result);
        assertEquals(testEntityDTO, result);
        verify(testEntityRepository).existsById(id);
        verify(Mapper).toEntity(testEntityDTO);
        verify(testEntityRepository).save(testEntity);
        verify(Mapper).toDTO(testEntity);
    }

    @Test
    void testUpdateNotFound() {
        // Given
        Long id = 1L;
        when(testEntityRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            testEntityService.update(id, testEntityDTO);
        });
        verify(testEntityRepository).existsById(id);
        verify(testEntityRepository, never()).save(any());
    }

    @Test
    void testDeleteById() {
        // Given
        Long id = 1L;
        when(testEntityRepository.existsById(id)).thenReturn(true);

        // When
        testEntityService.deleteById(id);

        // Then
        verify(testEntityRepository).existsById(id);
        verify(testEntityRepository).deleteById(id);
    }

    @Test
    void testDeleteByIdNotFound() {
        // Given
        Long id = 1L;
        when(testEntityRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            testEntityService.deleteById(id);
        });
        verify(testEntityRepository).existsById(id);
        verify(testEntityRepository, never()).deleteById(id);
    }

    @Test
    void testExistsById() {
        // Given
        Long id = 1L;
        when(testEntityRepository.existsById(id)).thenReturn(true);

        // When
        boolean result = testEntityService.existsById(id);

        // Then
        assertTrue(result);
        verify(testEntityRepository).existsById(id);
    }

    @Test
    void testFindAllPaginated() {
        // Given
        Pageable pageable = Pageable.ofSize(10);
        Page<TestEntity> page = new PageImpl<>(List.of(testEntity));
        when(testEntityRepository.findAll(pageable)).thenReturn(page);
        when(Mapper.toDTO(testEntity)).thenReturn(testEntityDTO);

        // When
        Page<TestEntityDTO> result = testEntityService.findAllPaginated(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(testEntityRepository).findAll(pageable);
        verify(Mapper).toDTO(testEntity);
    }




    @Test
    void testValidation() {
        // Given
        TestEntityDTO invalidTestEntityDTO = new TestEntityDTO();
        // Leave required fields empty to test validation

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            testEntityService.save(invalidTestEntityDTO);
        });
    }
}



