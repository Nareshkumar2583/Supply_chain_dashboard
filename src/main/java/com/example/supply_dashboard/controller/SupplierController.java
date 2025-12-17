package com.example.supply_dashboard.controller;
import com.example.supply_dashboard.entity.Supplier;
import com.example.supply_dashboard.repository.SupplierRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierRepository supplierRepository;

    public SupplierController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // Get all suppliers
    @GetMapping
    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    // Get supplier by ID
    @GetMapping("/{id}")
    public Supplier getById(@PathVariable Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    // Create new supplier
    @PostMapping
    public Supplier create(@RequestBody Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    // Update supplier
    @PutMapping("/{id}")
    public Supplier update(@PathVariable Long id, @RequestBody Supplier supplier) {
        supplier.setId(id);
        return supplierRepository.save(supplier);
    }

    // Delete supplier
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        supplierRepository.deleteById(id);
    }
}
