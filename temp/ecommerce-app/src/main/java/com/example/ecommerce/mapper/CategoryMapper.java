package com.example.ecommerce.mapper;

import com.example.ecommerce.entity.Category;
import com.example.ecommerce.dto.CategoryDTO;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    /**
     * Convierte Entity a DTO
     */
    public CategoryDTO toDTO(Category entity) {
        if (entity == null) {
            return null;
        }

        CategoryDTO dto = new CategoryDTO();
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setActive(entity.getActive());
        
        return dto;
    }

    /**
     * Convierte DTO a Entity
     */
    public Category toEntity(CategoryDTO dto) {
        if (dto == null) {
            return null;
        }

        Category entity = new Category();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setActive(dto.getActive());
        
        return entity;
    }

    /**
     * Actualiza Entity con datos del DTO
     */
    public void updateEntityFromDTO(Category entity, CategoryDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setActive(dto.getActive());
    }
}



