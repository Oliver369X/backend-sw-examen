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
public class CategoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    private Category category;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setName("Test name");
        category.setDescription("Test description");
        category.setActive(true);
    }

    @Test
    void testSaveCategory() {
        // Given
        Category savedCategory = categoryRepository.save(category);

        // Then
        assertNotNull(savedCategory);
        assertNotNull(savedCategory.getId());
        assertEquals("Test name", saved.getName());
        assertEquals("Test description", saved.getDescription());
        assertTrue(saved.getActive());
            }

    @Test
    void testFindById() {
        // Given
        Category savedCategory = categoryRepository.save(category);

        // When
        Optional<Category> foundCategory = categoryRepository.findById(savedCategory.getId());

        // Then
        assertTrue(foundCategory.isPresent());
        assertEquals(savedCategory.getId(), foundCategory.get().getId());
    }

    @Test
    void testUpdateCategory() {
        // Given
        Category savedCategory = categoryRepository.save(category);
        saved.setName("Updated name");
        saved.setDescription("Updated description");

        // When
        Category updatedCategory = categoryRepository.save(savedCategory);

        // Then
        assertEquals("Updated name", updated.getName());
        assertEquals("Updated description", updated.getDescription());
    }

    @Test
    void testDeleteCategory() {
        // Given
        Category savedCategory = categoryRepository.save(category);
        Long id = savedCategory.getId();

        // When
        categoryRepository.deleteById(id);

        // Then
        assertFalse(categoryRepository.existsById(id));
    }




    @Test
    void testEqualsAndHashCode() {
        // Given
        Category category1 = new Category();
        Category category2 = new Category();

        category1.setName("Test name");
        category2.setName("Test name");
        category1.setDescription("Test description");
        category2.setDescription("Test description");

        // When
        Category savedCategory1 = categoryRepository.save(category1);
        Category savedCategory2 = categoryRepository.save(category2);

        // Then
        assertNotEquals(savedCategory1, savedCategory2);
        assertNotEquals(savedCategory1.hashCode(), savedCategory2.hashCode());

        // Test with same ID
        savedCategory2.setId(savedCategory1.getId());
        assertEquals(savedCategory1, savedCategory2);
        assertEquals(savedCategory1.hashCode(), savedCategory2.hashCode());
    }
}



