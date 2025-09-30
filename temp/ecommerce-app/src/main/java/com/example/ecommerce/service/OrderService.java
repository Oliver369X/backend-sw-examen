package com.example.ecommerce.service;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.mapper.OrderMapper;
import com.example.ecommerce.repository.OrderRepository;
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
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderMapper orderMapper;

    // Basic CRUD Operations
    @Cacheable(value = "orders", key = "'all'")
    public List<OrderDTO> findAll() {
        logger.info("Finding all orders");
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "order", key = "#id")
    public Optional<OrderDTO> findById(Long id) {
        logger.info("Finding order with id: {}", id);
        return orderRepository.findById(id)
                .map(orderMapper::toDTO);
    }

    @Transactional
    @CacheEvict(value = {"orders", "order"}, allEntries = true)
    public OrderDTO save(OrderDTO orderDTO) {
        logger.info("Saving order: {}", orderDTO);
        validateOrderDTO(orderDTO);
        Order order = orderMapper.toEntity(orderDTO);
        Order savedOrder = orderRepository.save(order);
        return orderMapper.toDTO(savedOrder);
    }

    @Transactional
    @CachePut(value = "order", key = "#id")
    @CacheEvict(value = "orders", allEntries = true)
    public OrderDTO update(Long id, OrderDTO orderDTO) {
        logger.info("Updating order with id: {}", id);
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        validateOrderDTO(orderDTO);
        orderMapper.updateEntityFromDTO(existingOrder, orderDTO);
        Order updatedOrder = orderRepository.save(existingOrder);
        return orderMapper.toDTO(updatedOrder);
    }

    @Transactional
    @CacheEvict(value = {"orders", "order"}, key = "#id")
    public void deleteById(Long id) {
        logger.info("Deleting order with id: {}", id);
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return orderRepository.existsById(id);
    }

    // Advanced Operations
    public Page<OrderDTO> findAllPaginated(Pageable pageable) {
        logger.info("Finding all orders with pagination: {}", pageable);
        return orderRepository.findAll(pageable)
                .map(orderMapper::toDTO);
    }

    // Custom business methods
    public List<OrderDTO> findByStatus(String status) {
        logger.info("Finding orders by status: {}", status);
        // Implementar lógica específica según el dominio
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Validation Methods
    private void validateOrderDTO(OrderDTO orderDTO) {
        logger.debug("Validating order DTO: {}", orderDTO);
        
        if (orderDTO == null) {
            throw new IllegalArgumentException("Order DTO cannot be null");
        }
        
    }

    // Business Logic Methods
}
