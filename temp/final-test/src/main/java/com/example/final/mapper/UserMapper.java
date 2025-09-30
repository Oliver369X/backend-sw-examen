package com.example.final.mapper;

import com.example.final.entity.User;
import com.example.final.dto.UserDTO;
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
    }
}



