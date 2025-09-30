package com.example.ecommerce;

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
public class OrderTest {

    @Autowired
    private OrderRepository orderRepository;

    private Order order;

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setOrderNumber("Test orderNumber");
        order.setStatus("Test status");
        order.setShippingAddress("Test shippingAddress");
    }

    @Test
    void testSaveOrder() {
        // Given
        Order savedOrder = orderRepository.save(order);

        // Then
        assertNotNull(savedOrder);
        assertNotNull(savedOrder.getId());
        assertEquals("Test orderNumber", saved.getOrderNumber());
        assertEquals("Test status", saved.getStatus());
        assertEquals("Test shippingAddress", saved.getShippingAddress());
    }

    @Test
    void testFindById() {
        // Given
        Order savedOrder = orderRepository.save(order);

        // When
        Optional<Order> foundOrder = orderRepository.findById(savedOrder.getId());

        // Then
        assertTrue(foundOrder.isPresent());
        assertEquals(savedOrder.getId(), foundOrder.get().getId());
    }

    @Test
    void testUpdateOrder() {
        // Given
        Order savedOrder = orderRepository.save(order);
        saved.setOrderNumber("Updated orderNumber");
        saved.setStatus("Updated status");
        saved.setShippingAddress("Updated shippingAddress");

        // When
        Order updatedOrder = orderRepository.save(savedOrder);

        // Then
        assertEquals("Updated orderNumber", updated.getOrderNumber());
        assertEquals("Updated status", updated.getStatus());
        assertEquals("Updated shippingAddress", updated.getShippingAddress());
    }

    @Test
    void testDeleteOrder() {
        // Given
        Order savedOrder = orderRepository.save(order);
        Long id = savedOrder.getId();

        // When
        orderRepository.deleteById(id);

        // Then
        assertFalse(orderRepository.existsById(id));
    }



    @Test
    void testOrderBusinessMethods() {
        // Given
        Order savedOrder = orderRepository.save(order);

        // Test cancellation
        assertTrue(savedOrder.canBeCancelled());
        savedOrder.cancel();
        assertEquals("CANCELLED", savedOrder.getStatus());
    }

    @Test
    void testEqualsAndHashCode() {
        // Given
        Order order1 = new Order();
        Order order2 = new Order();

        order1.setOrderNumber("Test orderNumber");
        order2.setOrderNumber("Test orderNumber");
        order1.setStatus("Test status");
        order2.setStatus("Test status");
        order1.setShippingAddress("Test shippingAddress");
        order2.setShippingAddress("Test shippingAddress");

        // When
        Order savedOrder1 = orderRepository.save(order1);
        Order savedOrder2 = orderRepository.save(order2);

        // Then
        assertNotEquals(savedOrder1, savedOrder2);
        assertNotEquals(savedOrder1.hashCode(), savedOrder2.hashCode());

        // Test with same ID
        savedOrder2.setId(savedOrder1.getId());
        assertEquals(savedOrder1, savedOrder2);
        assertEquals(savedOrder1.hashCode(), savedOrder2.hashCode());
    }
}



