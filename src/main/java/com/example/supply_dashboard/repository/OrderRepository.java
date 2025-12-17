package com.example.supply_dashboard.repository;

import com.example.supply_dashboard.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<com.example.supply_dashboard.entity.OrderEntity,Long> {
    List<OrderEntity> findByStatus(String status);
}
