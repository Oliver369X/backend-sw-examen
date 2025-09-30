package com.example.test.service;

import com.example.test.dto.TestEntityDTO;
import com.example.test.entity.TestEntity;
import com.example.test.mapper.TestEntityMapper;
import com.example.test.repository.TestEntityRepository;
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
public class TestEntityService {

    private static final Logger logger = LoggerFactory.getLogger(TestEntityService.class);

    @Autowired
    private TestEntityRepository testentityRepository;

    @Autowired
    private TestEntityMapper testEntityMapper;

    // Basic CRUD Operations
    @Cacheable(value = "s", key = "'all'")
    public List<TestEntityDTO> findAll() {
        logger.info("Finding all s");
        return testentityRepository.findAll()
                .stream()
                .map(testEntityMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "", key = "#id")
    public Optional<TestEntityDTO> findById(Long id) {
        logger.info("Finding  with id: {}", id);
        return testentityRepository.findById(id)
                .map(testEntityMapper::toDTO);
    }

    @Transactional
    @CacheEvict(value = {"s", ""}, allEntries = true)
    public TestEntityDTO save(TestEntityDTO testEntityDTO) {
        logger.info("Saving : {}", testEntityDTO);
        validateTestEntityDTO(testEntityDTO);
        TestEntity testEntity = testEntityMapper.toEntity(testEntityDTO);
        TestEntity savedTestEntity = testentityRepository.save(testEntity);
        return testEntityMapper.toDTO(savedTestEntity);
    }

    @Transactional
    @CachePut(value = "", key = "#id")
    @CacheEvict(value = "s", allEntries = true)
    public TestEntityDTO update(Long id, TestEntityDTO testEntityDTO) {
        logger.info("Updating  with id: {}", id);
        TestEntity existingTestEntity = testentityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TestEntity not found with id: " + id));
        
        validateTestEntityDTO(testEntityDTO);
        testEntityMapper.updateEntityFromDTO(existingTestEntity, testEntityDTO);
        TestEntity updatedTestEntity = testentityRepository.save(existingTestEntity);
        return testEntityMapper.toDTO(updatedTestEntity);
    }

    @Transactional
    @CacheEvict(value = {"s", ""}, key = "#id")
    public void deleteById(Long id) {
        logger.info("Deleting  with id: {}", id);
        if (!testentityRepository.existsById(id)) {
            throw new RuntimeException("TestEntity not found with id: " + id);
        }
        testentityRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return testentityRepository.existsById(id);
    }

    // Advanced Operations
    public Page<TestEntityDTO> findAllPaginated(Pageable pageable) {
        logger.info("Finding all s with pagination: {}", pageable);
        return testentityRepository.findAll(pageable)
                .map(testEntityMapper::toDTO);
    }

    // Custom business methods
    public List<TestEntityDTO> findByStatus(String status) {
        logger.info("Finding s by status: {}", status);
        // Implementar lógica específica según el dominio
        return testentityRepository.findAll()
                .stream()
                .map(testEntityMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Validation Methods
    private void validateTestEntityDTO(TestEntityDTO testEntityDTO) {
        logger.debug("Validating  DTO: {}", testEntityDTO);
        
        if (testEntityDTO == null) {
            throw new IllegalArgumentException("TestEntity DTO cannot be null");
        }
        
    }

    // Business Logic Methods
}
