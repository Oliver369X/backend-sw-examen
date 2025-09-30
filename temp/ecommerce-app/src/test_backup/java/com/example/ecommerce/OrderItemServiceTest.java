package com.example.ecommerce;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class OrderItemServiceTest {

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private OrderItemMapper Mapper;

    @InjectMocks
    private OrderItemService orderItemService;

    private OrderItem orderItem;
    private OrderItemDTO orderItemDTO;

    @BeforeEach
    void setUp() {
        orderItem = new OrderItem();
        orderItem.setQuantity(1);
        
        orderItemDTO = new OrderItemDTO();
        orderItemDTO.setQuantity(1);
    }

    @Test
    void testFindAll() {
        // Given
        List<OrderItem> orderitems = List.of(orderItem);
        List<OrderItemDTO> orderitemsDTO = List.of(orderItemDTO);
        when(orderItemRepository.findAll()).thenReturn(orderitems);
        when(Mapper.toDTO(orderItem)).thenReturn(orderItemDTO);

        // When
        List<OrderItemDTO> result = orderItemService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(orderItemRepository).findAll();
        verify(Mapper).toDTO(orderItem);
    }

    @Test
    void testFindById() {
        // Given
        Long id = 1L;
        when(orderItemRepository.findById(id)).thenReturn(Optional.of(orderItem));
        when(Mapper.toDTO(orderItem)).thenReturn(orderItemDTO);

        // When
        Optional<OrderItemDTO> result = orderItemService.findById(id);

        // Then
        assertTrue(result.isPresent());
        assertEquals(orderItemDTO, result.get());
        verify(orderItemRepository).findById(id);
        verify(Mapper).toDTO(orderItem);
    }

    @Test
    void testFindByIdNotFound() {
        // Given
        Long id = 1L;
        when(orderItemRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Optional<OrderItemDTO> result = orderItemService.findById(id);

        // Then
        assertFalse(result.isPresent());
        verify(orderItemRepository).findById(id);
    }

    @Test
    void testSave() {
        // Given
        when(Mapper.toEntity(orderItemDTO)).thenReturn(orderItem);
        when(orderItemRepository.save(orderItem)).thenReturn(orderItem);
        when(Mapper.toDTO(orderItem)).thenReturn(orderItemDTO);

        // When
        OrderItemDTO result = orderItemService.save(orderItemDTO);

        // Then
        assertNotNull(result);
        assertEquals(orderItemDTO, result);
        verify(Mapper).toEntity(orderItemDTO);
        verify(orderItemRepository).save(orderItem);
        verify(Mapper).toDTO(orderItem);
    }

    @Test
    void testUpdate() {
        // Given
        Long id = 1L;
        orderItem.setId(id);
        when(orderItemRepository.existsById(id)).thenReturn(true);
        when(Mapper.toEntity(orderItemDTO)).thenReturn(orderItem);
        when(orderItemRepository.save(orderItem)).thenReturn(orderItem);
        when(Mapper.toDTO(orderItem)).thenReturn(orderItemDTO);

        // When
        OrderItemDTO result = orderItemService.update(id, orderItemDTO);

        // Then
        assertNotNull(result);
        assertEquals(orderItemDTO, result);
        verify(orderItemRepository).existsById(id);
        verify(Mapper).toEntity(orderItemDTO);
        verify(orderItemRepository).save(orderItem);
        verify(Mapper).toDTO(orderItem);
    }

    @Test
    void testUpdateNotFound() {
        // Given
        Long id = 1L;
        when(orderItemRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            orderItemService.update(id, orderItemDTO);
        });
        verify(orderItemRepository).existsById(id);
        verify(orderItemRepository, never()).save(any());
    }

    @Test
    void testDeleteById() {
        // Given
        Long id = 1L;
        when(orderItemRepository.existsById(id)).thenReturn(true);

        // When
        orderItemService.deleteById(id);

        // Then
        verify(orderItemRepository).existsById(id);
        verify(orderItemRepository).deleteById(id);
    }

    @Test
    void testDeleteByIdNotFound() {
        // Given
        Long id = 1L;
        when(orderItemRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            orderItemService.deleteById(id);
        });
        verify(orderItemRepository).existsById(id);
        verify(orderItemRepository, never()).deleteById(id);
    }

    @Test
    void testExistsById() {
        // Given
        Long id = 1L;
        when(orderItemRepository.existsById(id)).thenReturn(true);

        // When
        boolean result = orderItemService.existsById(id);

        // Then
        assertTrue(result);
        verify(orderItemRepository).existsById(id);
    }

    @Test
    void testFindAllPaginated() {
        // Given
        Pageable pageable = Pageable.ofSize(10);
        Page<OrderItem> page = new PageImpl<>(List.of(orderItem));
        when(orderItemRepository.findAll(pageable)).thenReturn(page);
        when(Mapper.toDTO(orderItem)).thenReturn(orderItemDTO);

        // When
        Page<OrderItemDTO> result = orderItemService.findAllPaginated(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(orderItemRepository).findAll(pageable);
        verify(Mapper).toDTO(orderItem);
    }




    @Test
    void testValidation() {
        // Given
        OrderItemDTO invalidOrderItemDTO = new OrderItemDTO();
        // Leave required fields empty to test validation

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            orderItemService.save(invalidOrderItemDTO);
        });
    }
}



