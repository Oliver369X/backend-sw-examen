package com.example.ecommerce.service;

import com.example.ecommerce.dto.CategoryDTO;
import com.example.ecommerce.entity.Category;
import com.example.ecommerce.mapper.CategoryMapper;
import com.example.ecommerce.repository.CategoryRepository;
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
public class CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    // Basic CRUD Operations
    @Cacheable(value = "categorys", key = "'all'")
    public List<CategoryDTO> findAll() {
        logger.info("Finding all categorys");
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "category", key = "#id")
    public Optional<CategoryDTO> findById(Long id) {
        logger.info("Finding category with id: {}", id);
        return categoryRepository.findById(id)
                .map(categoryMapper::toDTO);
    }

    @Transactional
    @CacheEvict(value = {"categorys", "category"}, allEntries = true)
    public CategoryDTO save(CategoryDTO categoryDTO) {
        logger.info("Saving category: {}", categoryDTO);
        validateCategoryDTO(categoryDTO);
        Category category = categoryMapper.toEntity(categoryDTO);
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toDTO(savedCategory);
    }

    @Transactional
    @CachePut(value = "category", key = "#id")
    @CacheEvict(value = "categorys", allEntries = true)
    public CategoryDTO update(Long id, CategoryDTO categoryDTO) {
        logger.info("Updating category with id: {}", id);
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        validateCategoryDTO(categoryDTO);
        categoryMapper.updateEntityFromDTO(existingCategory, categoryDTO);
        Category updatedCategory = categoryRepository.save(existingCategory);
        return categoryMapper.toDTO(updatedCategory);
    }

    @Transactional
    @CacheEvict(value = {"categorys", "category"}, key = "#id")
    public void deleteById(Long id) {
        logger.info("Deleting category with id: {}", id);
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return categoryRepository.existsById(id);
    }

    // Advanced Operations
    public Page<CategoryDTO> findAllPaginated(Pageable pageable) {
        logger.info("Finding all categorys with pagination: {}", pageable);
        return categoryRepository.findAll(pageable)
                .map(categoryMapper::toDTO);
    }

    // Custom business methods
    public List<CategoryDTO> findByStatus(String status) {
        logger.info("Finding categorys by status: {}", status);
        // Implementar lógica específica según el dominio
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Validation Methods
    private void validateCategoryDTO(CategoryDTO categoryDTO) {
        logger.debug("Validating category DTO: {}", categoryDTO);
        
        if (categoryDTO == null) {
            throw new IllegalArgumentException("Category DTO cannot be null");
        }
        
    }

    // Business Logic Methods
}
