package com.example.test;

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
public class TestEntityTest {

    @Autowired
    private TestEntityRepository testEntityRepository;

    private TestEntity testEntity;

    @BeforeEach
    void setUp() {
        testEntity = new TestEntity();
        .setName("Test name");
    }

    @Test
    void testSaveTestEntity() {
        // Given
        TestEntity savedTestEntity = testEntityRepository.save(testEntity);

        // Then
        assertNotNull(savedTestEntity);
        assertNotNull(savedTestEntity.getId());
        assertEquals("Test name", saved.getName());
    }

    @Test
    void testFindById() {
        // Given
        TestEntity savedTestEntity = testEntityRepository.save(testEntity);

        // When
        Optional<TestEntity> foundTestEntity = testEntityRepository.findById(savedTestEntity.getId());

        // Then
        assertTrue(foundTestEntity.isPresent());
        assertEquals(savedTestEntity.getId(), foundTestEntity.get().getId());
    }

    @Test
    void testUpdateTestEntity() {
        // Given
        TestEntity savedTestEntity = testEntityRepository.save(testEntity);
        saved.setName("Updated name");

        // When
        TestEntity updatedTestEntity = testEntityRepository.save(savedTestEntity);

        // Then
        assertEquals("Updated name", updated.getName());
    }

    @Test
    void testDeleteTestEntity() {
        // Given
        TestEntity savedTestEntity = testEntityRepository.save(testEntity);
        Long id = savedTestEntity.getId();

        // When
        testEntityRepository.deleteById(id);

        // Then
        assertFalse(testEntityRepository.existsById(id));
    }




    @Test
    void testEqualsAndHashCode() {
        // Given
        TestEntity testEntity1 = new TestEntity();
        TestEntity testEntity2 = new TestEntity();

        1.setName("Test name");
        2.setName("Test name");

        // When
        TestEntity savedTestEntity1 = testEntityRepository.save(testEntity1);
        TestEntity savedTestEntity2 = testEntityRepository.save(testEntity2);

        // Then
        assertNotEquals(savedTestEntity1, savedTestEntity2);
        assertNotEquals(savedTestEntity1.hashCode(), savedTestEntity2.hashCode());

        // Test with same ID
        savedTestEntity2.setId(savedTestEntity1.getId());
        assertEquals(savedTestEntity1, savedTestEntity2);
        assertEquals(savedTestEntity1.hashCode(), savedTestEntity2.hashCode());
    }
}



