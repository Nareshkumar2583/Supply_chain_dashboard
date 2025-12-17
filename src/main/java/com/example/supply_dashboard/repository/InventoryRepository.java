package com.example.supply_dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com. example. supply_dashboard. entity. Inventory;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface InventoryRepository extends JpaRepository<Inventory,Long> {
    List<Inventory> findByWarehouseId(Long warehouseId);
    List<Inventory> findByItemId(Long itemId);
}
