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
public class OrderItemTest {

    @Autowired
    private OrderItemRepository orderItemRepository;

    private OrderItem orderItem;

    @BeforeEach
    void setUp() {
        orderItem = new OrderItem();
        orderItem.setQuantity(1);
    }

    @Test
    void testSaveOrderItem() {
        // Given
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);

        // Then
        assertNotNull(savedOrderItem);
        assertNotNull(savedOrderItem.getId());
        assertEquals(1, saved.getQuantity());
    }

    @Test
    void testFindById() {
        // Given
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);

        // When
        Optional<OrderItem> foundOrderItem = orderItemRepository.findById(savedOrderItem.getId());

        // Then
        assertTrue(foundOrderItem.isPresent());
        assertEquals(savedOrderItem.getId(), foundOrderItem.get().getId());
    }

    @Test
    void testUpdateOrderItem() {
        // Given
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);
        saved.setQuantity(999);
        
        // When
        OrderItem updatedOrderItem = orderItemRepository.save(savedOrderItem);

        // Then
        assertEquals(999, updated.getQuantity());
            }

    @Test
    void testDeleteOrderItem() {
        // Given
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);
        Long id = savedOrderItem.getId();

        // When
        orderItemRepository.deleteById(id);

        // Then
        assertFalse(orderItemRepository.existsById(id));
    }




    @Test
    void testEqualsAndHashCode() {
        // Given
        OrderItem orderItem1 = new OrderItem();
        OrderItem orderItem2 = new OrderItem();


        // When
        OrderItem savedOrderItem1 = orderItemRepository.save(orderItem1);
        OrderItem savedOrderItem2 = orderItemRepository.save(orderItem2);

        // Then
        assertNotEquals(savedOrderItem1, savedOrderItem2);
        assertNotEquals(savedOrderItem1.hashCode(), savedOrderItem2.hashCode());

        // Test with same ID
        savedOrderItem2.setId(savedOrderItem1.getId());
        assertEquals(savedOrderItem1, savedOrderItem2);
        assertEquals(savedOrderItem1.hashCode(), savedOrderItem2.hashCode());
    }
}



