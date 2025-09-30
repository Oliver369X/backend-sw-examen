package com.example.ecommerce.mapper;

import com.example.ecommerce.entity.Order;
import com.example.ecommerce.dto.OrderDTO;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    /**
     * Convierte Entity a DTO
     */
    public OrderDTO toDTO(Order entity) {
        if (entity == null) {
            return null;
        }

        OrderDTO dto = new OrderDTO();
        dto.setOrderNumber(entity.getOrderNumber());
        dto.setOrderDate(entity.getOrderDate());
        dto.setStatus(entity.getStatus());
        dto.setTotal(entity.getTotal());
        dto.setShippingAddress(entity.getShippingAddress());
        
        return dto;
    }

    /**
     * Convierte DTO a Entity
     */
    public Order toEntity(OrderDTO dto) {
        if (dto == null) {
            return null;
        }

        Order entity = new Order();
        entity.setOrderNumber(dto.getOrderNumber());
        entity.setOrderDate(dto.getOrderDate());
        entity.setStatus(dto.getStatus());
        entity.setTotal(dto.getTotal());
        entity.setShippingAddress(dto.getShippingAddress());
        
        return entity;
    }

    /**
     * Actualiza Entity con datos del DTO
     */
    public void updateEntityFromDTO(Order entity, OrderDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setOrderNumber(dto.getOrderNumber());
        entity.setOrderDate(dto.getOrderDate());
        entity.setStatus(dto.getStatus());
        entity.setTotal(dto.getTotal());
        entity.setShippingAddress(dto.getShippingAddress());
    }
}



