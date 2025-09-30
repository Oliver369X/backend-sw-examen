package com.example.ecommerce.service;

import com.example.ecommerce.dto.OrderItemDTO;
import com.example.ecommerce.entity.OrderItem;
import com.example.ecommerce.mapper.OrderItemMapper;
import com.example.ecommerce.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderItemService {

    private static final Logger logger = LoggerFactory.getLogger(OrderItemService.class);

    @Autowired
    private OrderItemRepository orderitemRepository;

    @Autowired
    private OrderItemMapper orderItemMapper;

    // Basic CRUD Operations
    @Cacheable(value = "orderitems", key = "'all'")
    public List<OrderItemDTO> findAll() {
        logger.info("Finding all orderitems");
        return orderitemRepository.findAll()
                .stream()
                .map(orderItemMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "orderitem", key = "#id")
    public Optional<OrderItemDTO> findById(Long id) {
        logger.info("Finding orderitem with id: {}", id);
        return orderitemRepository.findById(id)
                .map(orderItemMapper::toDTO);
    }

    @Transactional
    @CacheEvict(value = {"orderitems", "orderitem"}, allEntries = true)
    public OrderItemDTO save(OrderItemDTO orderItemDTO) {
        logger.info("Saving orderitem: {}", orderItemDTO);
        validateOrderItemDTO(orderItemDTO);
        OrderItem orderItem = orderItemMapper.toEntity(orderItemDTO);
        OrderItem savedOrderItem = orderitemRepository.save(orderItem);
        return orderItemMapper.toDTO(savedOrderItem);
    }

    @Transactional
    @CachePut(value = "orderitem", key = "#id")
    @CacheEvict(value = "orderitems", allEntries = true)
    public OrderItemDTO update(Long id, OrderItemDTO orderItemDTO) {
        logger.info("Updating orderitem with id: {}", id);
        OrderItem existingOrderItem = orderitemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found with id: " + id));
        
        validateOrderItemDTO(orderItemDTO);
        orderItemMapper.updateEntityFromDTO(existingOrderItem, orderItemDTO);
        OrderItem updatedOrderItem = orderitemRepository.save(existingOrderItem);
        return orderItemMapper.toDTO(updatedOrderItem);
    }

    @Transactional
    @CacheEvict(value = {"orderitems", "orderitem"}, key = "#id")
    public void deleteById(Long id) {
        logger.info("Deleting orderitem with id: {}", id);
        if (!orderitemRepository.existsById(id)) {
            throw new RuntimeException("OrderItem not found with id: " + id);
        }
        orderitemRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return orderitemRepository.existsById(id);
    }

    // Advanced Operations
    public Page<OrderItemDTO> findAllPaginated(Pageable pageable) {
        logger.info("Finding all orderitems with pagination: {}", pageable);
        return orderitemRepository.findAll(pageable)
                .map(orderItemMapper::toDTO);
    }

    // Custom business methods
    public List<OrderItemDTO> findByStatus(String status) {
        logger.info("Finding orderitems by status: {}", status);
        // Implementar lógica específica según el dominio
        return orderitemRepository.findAll()
                .stream()
                .map(orderItemMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Validation Methods
    private void validateOrderItemDTO(OrderItemDTO orderItemDTO) {
        logger.debug("Validating orderitem DTO: {}", orderItemDTO);
        
        if (orderItemDTO == null) {
            throw new IllegalArgumentException("OrderItem DTO cannot be null");
        }
        
    }

    // Business Logic Methods
}
