package com.example.supply_dashboard.controller;

import com.example.supply_dashboard.entity.OrderEntity;
import com.example.supply_dashboard.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Get all orders
    @GetMapping
    public List<OrderEntity> getAll() {
        return orderRepository.findAll();
    }

    // Get order by ID
    @GetMapping("/{id}")
    public OrderEntity getById(@PathVariable Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    // Get orders by status (Processing, Shipped, Delivered)
    @GetMapping("/status/{status}")
    public List<OrderEntity> getByStatus(@PathVariable String status) {
        return orderRepository.findByStatus(status);
    }

    // Create new order
    @PostMapping
    public OrderEntity create(@RequestBody OrderEntity order) {
        return orderRepository.save(order);
    }

    // Update existing order
    @PutMapping("/{id}")
    public OrderEntity update(@PathVariable Long id, @RequestBody OrderEntity order) {
        order.setId(id);
        return orderRepository.save(order);
    }

    // Delete order
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}
