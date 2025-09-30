package com.example.ecommerce.mapper;

import com.example.ecommerce.entity.User;
import com.example.ecommerce.dto.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    /**
     * Convierte Entity a DTO
     */
    public UserDTO toDTO(User entity) {
        if (entity == null) {
            return null;
        }

        UserDTO dto = new UserDTO();
        dto.setEmail(entity.getEmail());
        dto.setUsername(entity.getUsername());
        dto.setPassword(entity.getPassword());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setPhone(entity.getPhone());
        dto.setActive(entity.getActive());
        
        return dto;
    }

    /**
     * Convierte DTO a Entity
     */
    public User toEntity(UserDTO dto) {
        if (dto == null) {
            return null;
        }

        User entity = new User();
        entity.setEmail(dto.getEmail());
        entity.setUsername(dto.getUsername());
        entity.setPassword(dto.getPassword());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setPhone(dto.getPhone());
        entity.setActive(dto.getActive());
        
        return entity;
    }

    /**
     * Actualiza Entity con datos del DTO
     */
    public void updateEntityFromDTO(User entity, UserDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setEmail(dto.getEmail());
        entity.setUsername(dto.getUsername());
        entity.setPassword(dto.getPassword());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setPhone(dto.getPhone());
        entity.setActive(dto.getActive());
    }
}



