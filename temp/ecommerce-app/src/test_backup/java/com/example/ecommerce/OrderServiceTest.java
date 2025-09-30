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
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderMapper Mapper;

    @InjectMocks
    private OrderService orderService;

    private Order order;
    private OrderDTO orderDTO;

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setOrderNumber("Test orderNumber");
        order.setStatus("Test status");
        order.setShippingAddress("Test shippingAddress");
        
        orderDTO = new OrderDTO();
        orderDTO.setOrderNumber("Test orderNumber");
        orderDTO.setStatus("Test status");
        orderDTO.setShippingAddress("Test shippingAddress");
    }

    @Test
    void testFindAll() {
        // Given
        List<Order> orders = List.of(order);
        List<OrderDTO> ordersDTO = List.of(orderDTO);
        when(orderRepository.findAll()).thenReturn(orders);
        when(Mapper.toDTO(order)).thenReturn(orderDTO);

        // When
        List<OrderDTO> result = orderService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(orderRepository).findAll();
        verify(Mapper).toDTO(order);
    }

    @Test
    void testFindById() {
        // Given
        Long id = 1L;
        when(orderRepository.findById(id)).thenReturn(Optional.of(order));
        when(Mapper.toDTO(order)).thenReturn(orderDTO);

        // When
        Optional<OrderDTO> result = orderService.findById(id);

        // Then
        assertTrue(result.isPresent());
        assertEquals(orderDTO, result.get());
        verify(orderRepository).findById(id);
        verify(Mapper).toDTO(order);
    }

    @Test
    void testFindByIdNotFound() {
        // Given
        Long id = 1L;
        when(orderRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Optional<OrderDTO> result = orderService.findById(id);

        // Then
        assertFalse(result.isPresent());
        verify(orderRepository).findById(id);
    }

    @Test
    void testSave() {
        // Given
        when(Mapper.toEntity(orderDTO)).thenReturn(order);
        when(orderRepository.save(order)).thenReturn(order);
        when(Mapper.toDTO(order)).thenReturn(orderDTO);

        // When
        OrderDTO result = orderService.save(orderDTO);

        // Then
        assertNotNull(result);
        assertEquals(orderDTO, result);
        verify(Mapper).toEntity(orderDTO);
        verify(orderRepository).save(order);
        verify(Mapper).toDTO(order);
    }

    @Test
    void testUpdate() {
        // Given
        Long id = 1L;
        order.setId(id);
        when(orderRepository.existsById(id)).thenReturn(true);
        when(Mapper.toEntity(orderDTO)).thenReturn(order);
        when(orderRepository.save(order)).thenReturn(order);
        when(Mapper.toDTO(order)).thenReturn(orderDTO);

        // When
        OrderDTO result = orderService.update(id, orderDTO);

        // Then
        assertNotNull(result);
        assertEquals(orderDTO, result);
        verify(orderRepository).existsById(id);
        verify(Mapper).toEntity(orderDTO);
        verify(orderRepository).save(order);
        verify(Mapper).toDTO(order);
    }

    @Test
    void testUpdateNotFound() {
        // Given
        Long id = 1L;
        when(orderRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            orderService.update(id, orderDTO);
        });
        verify(orderRepository).existsById(id);
        verify(orderRepository, never()).save(any());
    }

    @Test
    void testDeleteById() {
        // Given
        Long id = 1L;
        when(orderRepository.existsById(id)).thenReturn(true);

        // When
        orderService.deleteById(id);

        // Then
        verify(orderRepository).existsById(id);
        verify(orderRepository).deleteById(id);
    }

    @Test
    void testDeleteByIdNotFound() {
        // Given
        Long id = 1L;
        when(orderRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            orderService.deleteById(id);
        });
        verify(orderRepository).existsById(id);
        verify(orderRepository, never()).deleteById(id);
    }

    @Test
    void testExistsById() {
        // Given
        Long id = 1L;
        when(orderRepository.existsById(id)).thenReturn(true);

        // When
        boolean result = orderService.existsById(id);

        // Then
        assertTrue(result);
        verify(orderRepository).existsById(id);
    }

    @Test
    void testFindAllPaginated() {
        // Given
        Pageable pageable = Pageable.ofSize(10);
        Page<Order> page = new PageImpl<>(List.of(order));
        when(orderRepository.findAll(pageable)).thenReturn(page);
        when(Mapper.toDTO(order)).thenReturn(orderDTO);

        // When
        Page<OrderDTO> result = orderService.findAllPaginated(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(orderRepository).findAll(pageable);
        verify(Mapper).toDTO(order);
    }



    @Test
    void testFindByStatus() {
        // Given
        String status = "PENDING";
        List<Order> orders = List.of(order);
        when(orderRepository.findByStatus(status)).thenReturn(orders);

        // When
        List<Order> result = orderService.findByStatus(status);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(orderRepository).findByStatus(status);
    }

    @Test
    void testCancelOrder() {
        // Given
        Long id = 1L;
        when(orderRepository.findById(id)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        // When
        Order result = orderService.cancelOrder(id);

        // Then
        assertNotNull(result);
        verify(orderRepository).findById(id);
        verify(orderRepository).save(order);
    }

    @Test
    void testValidation() {
        // Given
        OrderDTO invalidOrderDTO = new OrderDTO();
        // Leave required fields empty to test validation

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            orderService.save(invalidOrderDTO);
        });
    }
}



