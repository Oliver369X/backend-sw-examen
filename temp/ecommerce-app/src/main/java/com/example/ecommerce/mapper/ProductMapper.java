package com.example.ecommerce.mapper;

import com.example.ecommerce.entity.Product;
import com.example.ecommerce.dto.ProductDTO;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    /**
     * Convierte Entity a DTO
     */
    public ProductDTO toDTO(Product entity) {
        if (entity == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setStock(entity.getStock());
        dto.setSku(entity.getSku());
        dto.setActive(entity.getActive());
        
        return dto;
    }

    /**
     * Convierte DTO a Entity
     */
    public Product toEntity(ProductDTO dto) {
        if (dto == null) {
            return null;
        }

        Product entity = new Product();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setStock(dto.getStock());
        entity.setSku(dto.getSku());
        entity.setActive(dto.getActive());
        
        return entity;
    }

    /**
     * Actualiza Entity con datos del DTO
     */
    public void updateEntityFromDTO(Product entity, ProductDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setStock(dto.getStock());
        entity.setSku(dto.getSku());
        entity.setActive(dto.getActive());
    }
}



