package com.example.test.mapper;

import com.example.test.entity.TestEntity;
import com.example.test.dto.TestEntityDTO;
import org.springframework.stereotype.Component;

@Component
public class TestEntityMapper {

    /**
     * Convierte Entity a DTO
     */
    public TestEntityDTO toDTO(TestEntity entity) {
        if (entity == null) {
            return null;
        }

        TestEntityDTO dto = new TestEntityDTO();
        dto.setName(entity.getName());
        
        return dto;
    }

    /**
     * Convierte DTO a Entity
     */
    public TestEntity toEntity(TestEntityDTO dto) {
        if (dto == null) {
            return null;
        }

        TestEntity entity = new TestEntity();
        entity.setName(dto.getName());
        
        return entity;
    }

    /**
     * Actualiza Entity con datos del DTO
     */
    public void updateEntityFromDTO(TestEntity entity, TestEntityDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setName(dto.getName());
    }
}



