package com.example.ecommerce.controller;

import com.example.ecommerce.dto.OrderItemDTO;
import com.example.ecommerce.service.OrderItemService;
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
@RequestMapping("/api/order-item")
@CrossOrigin(origins = "*")
@Validated
public class OrderItemController {

    private static final Logger logger = LoggerFactory.getLogger(OrderItemController.class);

    @Autowired
    private OrderItemService orderitemService;

    // Basic CRUD Operations
    @GetMapping
    public ResponseEntity<List<OrderItemDTO>> getAllOrderItems() {
        logger.info("Getting all s");
        List<OrderItemDTO> orderitems = orderitemService.findAll();
        return ResponseEntity.ok(orderitems);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<OrderItemDTO>> getAllOrderItemsPaginated(
            @PageableDefault(size = 10) Pageable pageable) {
        logger.info("Getting all s with pagination: {}", pageable);
        Page<OrderItemDTO> orderitems = orderitemService.findAllPaginated(pageable);
        return ResponseEntity.ok(orderitems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItemDTO> getOrderItemById(@PathVariable Long id) {
        logger.info("Getting  by id: {}", id);
        Optional<OrderItemDTO> orderitem = orderitemService.findById(id);
        return orderitem.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OrderItemDTO> createOrderItem(@Valid @RequestBody OrderItemDTO orderitemDTO) {
        logger.info("Creating new : {}", orderitemDTO);
        try {
            OrderItemDTO savedOrderItem = orderitemService.save(orderitemDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedOrderItem);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error creating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItemDTO> updateOrderItem(@PathVariable Long id, 
                                                             @Valid @RequestBody OrderItemDTO orderitemDTO) {
        logger.info("Updating  with id: {}", id);
        try {
            OrderItemDTO updatedOrderItem = orderitemService.update(id, orderitemDTO);
            return ResponseEntity.ok(updatedOrderItem);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error updating : {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            logger.error("Error updating : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        logger.info("Deleting  with id: {}", id);
        try {
            orderitemService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Custom endpoints
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderItemDTO>> getByStatus(@PathVariable String status) {
        logger.info("Getting s by status: {}", status);
        List<OrderItemDTO> orderitems = orderitemService.findByStatus(status);
        return ResponseEntity.ok(orderitems);
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OrderItemController is healthy");
    }

    // Custom endpoints
}
