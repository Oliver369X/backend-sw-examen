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
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper Mapper;

    @InjectMocks
    private CategoryService categoryService;

    private Category category;
    private CategoryDTO categoryDTO;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setName("Test name");
        category.setDescription("Test description");
        category.setActive(true);
        
        categoryDTO = new CategoryDTO();
        categoryDTO.setName("Test name");
        categoryDTO.setDescription("Test description");
        categoryDTO.setActive(true);
    }

    @Test
    void testFindAll() {
        // Given
        List<Category> categorys = List.of(category);
        List<CategoryDTO> categorysDTO = List.of(categoryDTO);
        when(categoryRepository.findAll()).thenReturn(categorys);
        when(Mapper.toDTO(category)).thenReturn(categoryDTO);

        // When
        List<CategoryDTO> result = categoryService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(categoryRepository).findAll();
        verify(Mapper).toDTO(category);
    }

    @Test
    void testFindById() {
        // Given
        Long id = 1L;
        when(categoryRepository.findById(id)).thenReturn(Optional.of(category));
        when(Mapper.toDTO(category)).thenReturn(categoryDTO);

        // When
        Optional<CategoryDTO> result = categoryService.findById(id);

        // Then
        assertTrue(result.isPresent());
        assertEquals(categoryDTO, result.get());
        verify(categoryRepository).findById(id);
        verify(Mapper).toDTO(category);
    }

    @Test
    void testFindByIdNotFound() {
        // Given
        Long id = 1L;
        when(categoryRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Optional<CategoryDTO> result = categoryService.findById(id);

        // Then
        assertFalse(result.isPresent());
        verify(categoryRepository).findById(id);
    }

    @Test
    void testSave() {
        // Given
        when(Mapper.toEntity(categoryDTO)).thenReturn(category);
        when(categoryRepository.save(category)).thenReturn(category);
        when(Mapper.toDTO(category)).thenReturn(categoryDTO);

        // When
        CategoryDTO result = categoryService.save(categoryDTO);

        // Then
        assertNotNull(result);
        assertEquals(categoryDTO, result);
        verify(Mapper).toEntity(categoryDTO);
        verify(categoryRepository).save(category);
        verify(Mapper).toDTO(category);
    }

    @Test
    void testUpdate() {
        // Given
        Long id = 1L;
        category.setId(id);
        when(categoryRepository.existsById(id)).thenReturn(true);
        when(Mapper.toEntity(categoryDTO)).thenReturn(category);
        when(categoryRepository.save(category)).thenReturn(category);
        when(Mapper.toDTO(category)).thenReturn(categoryDTO);

        // When
        CategoryDTO result = categoryService.update(id, categoryDTO);

        // Then
        assertNotNull(result);
        assertEquals(categoryDTO, result);
        verify(categoryRepository).existsById(id);
        verify(Mapper).toEntity(categoryDTO);
        verify(categoryRepository).save(category);
        verify(Mapper).toDTO(category);
    }

    @Test
    void testUpdateNotFound() {
        // Given
        Long id = 1L;
        when(categoryRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            categoryService.update(id, categoryDTO);
        });
        verify(categoryRepository).existsById(id);
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void testDeleteById() {
        // Given
        Long id = 1L;
        when(categoryRepository.existsById(id)).thenReturn(true);

        // When
        categoryService.deleteById(id);

        // Then
        verify(categoryRepository).existsById(id);
        verify(categoryRepository).deleteById(id);
    }

    @Test
    void testDeleteByIdNotFound() {
        // Given
        Long id = 1L;
        when(categoryRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            categoryService.deleteById(id);
        });
        verify(categoryRepository).existsById(id);
        verify(categoryRepository, never()).deleteById(id);
    }

    @Test
    void testExistsById() {
        // Given
        Long id = 1L;
        when(categoryRepository.existsById(id)).thenReturn(true);

        // When
        boolean result = categoryService.existsById(id);

        // Then
        assertTrue(result);
        verify(categoryRepository).existsById(id);
    }

    @Test
    void testFindAllPaginated() {
        // Given
        Pageable pageable = Pageable.ofSize(10);
        Page<Category> page = new PageImpl<>(List.of(category));
        when(categoryRepository.findAll(pageable)).thenReturn(page);
        when(Mapper.toDTO(category)).thenReturn(categoryDTO);

        // When
        Page<CategoryDTO> result = categoryService.findAllPaginated(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(categoryRepository).findAll(pageable);
        verify(Mapper).toDTO(category);
    }




    @Test
    void testValidation() {
        // Given
        CategoryDTO invalidCategoryDTO = new CategoryDTO();
        // Leave required fields empty to test validation

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            categoryService.save(invalidCategoryDTO);
        });
    }
}



