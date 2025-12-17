package com.example.supply_dashboard.controller;

import com.example.supply_dashboard.entity.Inventory;
import com.example.supply_dashboard.repository.InventoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventories")
public class InventoryController {

    private final InventoryRepository inventoryRepository;

    public InventoryController(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    // Get all inventories
    @GetMapping
    public List<Inventory> getAll() {
        return inventoryRepository.findAll();
    }

    // Get inventory by warehouse
    @GetMapping("/warehouse/{warehouseId}")
    public List<Inventory> getByWarehouse(@PathVariable Long warehouseId) {
        return inventoryRepository.findByWarehouseId(warehouseId);
    }

    // Get inventory by item
    @GetMapping("/item/{itemId}")
    public List<Inventory> getByItem(@PathVariable Long itemId) {
        return inventoryRepository.findByItemId(itemId);
    }

    // Create new inventory entry
    @PostMapping
    public Inventory create(@RequestBody Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    // Update inventory entry
    @PutMapping("/{id}")
    public Inventory update(@PathVariable Long id, @RequestBody Inventory inventory) {
        inventory.setId(id);
        return inventoryRepository.save(inventory);
    }

    // Delete inventory entry
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        inventoryRepository.deleteById(id);
    }
}
