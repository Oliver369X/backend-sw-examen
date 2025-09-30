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
public class ProductTest {

    @Autowired
    private ProductRepository productRepository;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Test name");
        product.setDescription("Test description");
        product.setStock(1);
        product.setSku("Test sku");
        product.setActive(true);
    }

    @Test
    void testSaveProduct() {
        // Given
        Product savedProduct = productRepository.save(product);

        // Then
        assertNotNull(savedProduct);
        assertNotNull(savedProduct.getId());
        assertEquals("Test name", saved.getName());
        assertEquals("Test description", saved.getDescription());
        assertEquals(1, saved.getStock());
        assertEquals("Test sku", saved.getSku());
        assertTrue(saved.getActive());
            }

    @Test
    void testFindById() {
        // Given
        Product savedProduct = productRepository.save(product);

        // When
        Optional<Product> foundProduct = productRepository.findById(savedProduct.getId());

        // Then
        assertTrue(foundProduct.isPresent());
        assertEquals(savedProduct.getId(), foundProduct.get().getId());
    }

    @Test
    void testUpdateProduct() {
        // Given
        Product savedProduct = productRepository.save(product);
        saved.setName("Updated name");
        saved.setDescription("Updated description");
        saved.setStock(999);
                saved.setSku("Updated sku");

        // When
        Product updatedProduct = productRepository.save(savedProduct);

        // Then
        assertEquals("Updated name", updated.getName());
        assertEquals("Updated description", updated.getDescription());
        assertEquals(999, updated.getStock());
                assertEquals("Updated sku", updated.getSku());
    }

    @Test
    void testDeleteProduct() {
        // Given
        Product savedProduct = productRepository.save(product);
        Long id = savedProduct.getId();

        // When
        productRepository.deleteById(id);

        // Then
        assertFalse(productRepository.existsById(id));
    }


    @Test
    void testProductBusinessMethods() {
        // Given
        product.setStock(10);
        Product savedProduct = productRepository.save(product);

        // Test stock methods
        assertTrue(savedProduct.isInStock());

        savedProduct.decreaseStock(5);
        assertEquals(5, savedProduct.getStock());

        savedProduct.increaseStock(3);
        assertEquals(8, savedProduct.getStock());

        // Test insufficient stock
        assertThrows(IllegalStateException.class, () -> {
            savedProduct.decreaseStock(20);
        });
    }


    @Test
    void testEqualsAndHashCode() {
        // Given
        Product product1 = new Product();
        Product product2 = new Product();

        product1.setName("Test name");
        product2.setName("Test name");
        product1.setDescription("Test description");
        product2.setDescription("Test description");
        product1.setSku("Test sku");
        product2.setSku("Test sku");

        // When
        Product savedProduct1 = productRepository.save(product1);
        Product savedProduct2 = productRepository.save(product2);

        // Then
        assertNotEquals(savedProduct1, savedProduct2);
        assertNotEquals(savedProduct1.hashCode(), savedProduct2.hashCode());

        // Test with same ID
        savedProduct2.setId(savedProduct1.getId());
        assertEquals(savedProduct1, savedProduct2);
        assertEquals(savedProduct1.hashCode(), savedProduct2.hashCode());
    }
}



