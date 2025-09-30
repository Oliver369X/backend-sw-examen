package com.example.ecommerce.mapper;

import com.example.ecommerce.entity.OrderItem;
import com.example.ecommerce.dto.OrderItemDTO;
import org.springframework.stereotype.Component;

@Component
public class OrderItemMapper {

    /**
     * Convierte Entity a DTO
     */
    public OrderItemDTO toDTO(OrderItem entity) {
        if (entity == null) {
            return null;
        }

        OrderItemDTO dto = new OrderItemDTO();
        dto.setQuantity(entity.getQuantity());
        dto.setUnitPrice(entity.getUnitPrice());
        dto.setSubtotal(entity.getSubtotal());
        
        return dto;
    }

    /**
     * Convierte DTO a Entity
     */
    public OrderItem toEntity(OrderItemDTO dto) {
        if (dto == null) {
            return null;
        }

        OrderItem entity = new OrderItem();
        entity.setQuantity(dto.getQuantity());
        entity.setUnitPrice(dto.getUnitPrice());
        entity.setSubtotal(dto.getSubtotal());
        
        return entity;
    }

    /**
     * Actualiza Entity con datos del DTO
     */
    public void updateEntityFromDTO(OrderItem entity, OrderItemDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setQuantity(dto.getQuantity());
        entity.setUnitPrice(dto.getUnitPrice());
        entity.setSubtotal(dto.getSubtotal());
    }
}



