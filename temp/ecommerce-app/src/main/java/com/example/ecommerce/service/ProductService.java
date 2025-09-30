package com.example.ecommerce.service;

import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.mapper.ProductMapper;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    // Basic CRUD Operations
    @Cacheable(value = "products", key = "'all'")
    public List<ProductDTO> findAll() {
        logger.info("Finding all products");
        return productRepository.findAll()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "product", key = "#id")
    public Optional<ProductDTO> findById(Long id) {
        logger.info("Finding product with id: {}", id);
        return productRepository.findById(id)
                .map(productMapper::toDTO);
    }

    @Transactional
    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public ProductDTO save(ProductDTO productDTO) {
        logger.info("Saving product: {}", productDTO);
        validateProductDTO(productDTO);
        Product product = productMapper.toEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        return productMapper.toDTO(savedProduct);
    }

    @Transactional
    @CachePut(value = "product", key = "#id")
    @CacheEvict(value = "products", allEntries = true)
    public ProductDTO update(Long id, ProductDTO productDTO) {
        logger.info("Updating product with id: {}", id);
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        validateProductDTO(productDTO);
        productMapper.updateEntityFromDTO(existingProduct, productDTO);
        Product updatedProduct = productRepository.save(existingProduct);
        return productMapper.toDTO(updatedProduct);
    }

    @Transactional
    @CacheEvict(value = {"products", "product"}, key = "#id")
    public void deleteById(Long id) {
        logger.info("Deleting product with id: {}", id);
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }

    // Advanced Operations
    public Page<ProductDTO> findAllPaginated(Pageable pageable) {
        logger.info("Finding all products with pagination: {}", pageable);
        return productRepository.findAll(pageable)
                .map(productMapper::toDTO);
    }

    // Custom business methods
    public List<ProductDTO> findByStatus(String status) {
        logger.info("Finding products by status: {}", status);
        // Implementar lógica específica según el dominio
        return productRepository.findAll()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Validation Methods
    private void validateProductDTO(ProductDTO productDTO) {
        logger.debug("Validating product DTO: {}", productDTO);
        
        if (productDTO == null) {
            throw new IllegalArgumentException("Product DTO cannot be null");
        }
        
    }

    // Business Logic Methods
}
