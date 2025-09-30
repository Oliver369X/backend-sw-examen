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
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper Mapper;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private ProductDTO productDTO;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Test name");
        product.setDescription("Test description");
        product.setStock(1);
        product.setSku("Test sku");
        product.setActive(true);
        
        productDTO = new ProductDTO();
        productDTO.setName("Test name");
        productDTO.setDescription("Test description");
        productDTO.setStock(1);
        productDTO.setSku("Test sku");
        productDTO.setActive(true);
    }

    @Test
    void testFindAll() {
        // Given
        List<Product> products = List.of(product);
        List<ProductDTO> productsDTO = List.of(productDTO);
        when(productRepository.findAll()).thenReturn(products);
        when(Mapper.toDTO(product)).thenReturn(productDTO);

        // When
        List<ProductDTO> result = productService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productRepository).findAll();
        verify(Mapper).toDTO(product);
    }

    @Test
    void testFindById() {
        // Given
        Long id = 1L;
        when(productRepository.findById(id)).thenReturn(Optional.of(product));
        when(Mapper.toDTO(product)).thenReturn(productDTO);

        // When
        Optional<ProductDTO> result = productService.findById(id);

        // Then
        assertTrue(result.isPresent());
        assertEquals(productDTO, result.get());
        verify(productRepository).findById(id);
        verify(Mapper).toDTO(product);
    }

    @Test
    void testFindByIdNotFound() {
        // Given
        Long id = 1L;
        when(productRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Optional<ProductDTO> result = productService.findById(id);

        // Then
        assertFalse(result.isPresent());
        verify(productRepository).findById(id);
    }

    @Test
    void testSave() {
        // Given
        when(Mapper.toEntity(productDTO)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(product);
        when(Mapper.toDTO(product)).thenReturn(productDTO);

        // When
        ProductDTO result = productService.save(productDTO);

        // Then
        assertNotNull(result);
        assertEquals(productDTO, result);
        verify(Mapper).toEntity(productDTO);
        verify(productRepository).save(product);
        verify(Mapper).toDTO(product);
    }

    @Test
    void testUpdate() {
        // Given
        Long id = 1L;
        product.setId(id);
        when(productRepository.existsById(id)).thenReturn(true);
        when(Mapper.toEntity(productDTO)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(product);
        when(Mapper.toDTO(product)).thenReturn(productDTO);

        // When
        ProductDTO result = productService.update(id, productDTO);

        // Then
        assertNotNull(result);
        assertEquals(productDTO, result);
        verify(productRepository).existsById(id);
        verify(Mapper).toEntity(productDTO);
        verify(productRepository).save(product);
        verify(Mapper).toDTO(product);
    }

    @Test
    void testUpdateNotFound() {
        // Given
        Long id = 1L;
        when(productRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            productService.update(id, productDTO);
        });
        verify(productRepository).existsById(id);
        verify(productRepository, never()).save(any());
    }

    @Test
    void testDeleteById() {
        // Given
        Long id = 1L;
        when(productRepository.existsById(id)).thenReturn(true);

        // When
        productService.deleteById(id);

        // Then
        verify(productRepository).existsById(id);
        verify(productRepository).deleteById(id);
    }

    @Test
    void testDeleteByIdNotFound() {
        // Given
        Long id = 1L;
        when(productRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            productService.deleteById(id);
        });
        verify(productRepository).existsById(id);
        verify(productRepository, never()).deleteById(id);
    }

    @Test
    void testExistsById() {
        // Given
        Long id = 1L;
        when(productRepository.existsById(id)).thenReturn(true);

        // When
        boolean result = productService.existsById(id);

        // Then
        assertTrue(result);
        verify(productRepository).existsById(id);
    }

    @Test
    void testFindAllPaginated() {
        // Given
        Pageable pageable = Pageable.ofSize(10);
        Page<Product> page = new PageImpl<>(List.of(product));
        when(productRepository.findAll(pageable)).thenReturn(page);
        when(Mapper.toDTO(product)).thenReturn(productDTO);

        // When
        Page<ProductDTO> result = productService.findAllPaginated(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(productRepository).findAll(pageable);
        verify(Mapper).toDTO(product);
    }


    @Test
    void testFindByCategory() {
        // Given
        String category = "Electronics";
        List<Product> products = List.of(product);
        when(productRepository.findByCategory(category)).thenReturn(products);

        // When
        List<Product> result = productService.findByCategory(category);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productRepository).findByCategory(category);
    }

    @Test
    void testFindInStockProducts() {
        // Given
        List<Product> allProducts = List.of(product);
        when(productRepository.findAll()).thenReturn(allProducts);

        // When
        List<Product> result = productService.findInStockProducts();

        // Then
        assertNotNull(result);
        verify(productRepository).findAll();
    }

    @Test
    void testUpdateStock() {
        // Given
        Long id = 1L;
        int quantity = 5;
        when(productRepository.findById(id)).thenReturn(Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);

        // When
        Product result = productService.updateStock(id, quantity);

        // Then
        assertNotNull(result);
        verify(productRepository).findById(id);
        verify(productRepository).save(product);
    }


    @Test
    void testValidation() {
        // Given
        ProductDTO invalidProductDTO = new ProductDTO();
        // Leave required fields empty to test validation

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            productService.save(invalidProductDTO);
        });
    }
}



