package com.example.ecommerce.controller;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.validation.annotation.Validated;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "*")
@Validated
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    // Basic CRUD Operations
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        logger.info("Getting all s");
        List<OrderDTO> orders = orderService.findAll();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<OrderDTO>> getAllOrdersPaginated(
            @PageableDefault(size = 10) Pageable pageable) {
        logger.info("Getting all s with pagination: {}", pageable);
        Page<OrderDTO> orders = orderService.findAllPaginated(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        logger.info("Getting  by id: {}", id);
        Optional<OrderDTO> order = orderService.findById(id);
        return order.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        logger.info("Creating new : {}", orderDTO);
        try {
            OrderDTO savedOrder = orderService.save(orderDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error creating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long id, 
                                                             @Valid @RequestBody OrderDTO orderDTO) {
        logger.info("Updating  with id: {}", id);
        try {
            OrderDTO updatedOrder = orderService.update(id, orderDTO);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error updating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            logger.error("Error updating : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        logger.info("Deleting  with id: {}", id);
        try {
            orderService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Custom endpoints
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderDTO>> getByStatus(@PathVariable String status) {
        logger.info("Getting s by status: {}", status);
        List<OrderDTO> orders = orderService.findByStatus(status);
        return ResponseEntity.ok(orders);
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OrderController is healthy");
    }

    // Custom endpoints
}
