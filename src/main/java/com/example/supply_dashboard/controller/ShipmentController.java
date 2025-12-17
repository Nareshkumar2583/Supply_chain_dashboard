package com.example.supply_dashboard.controller;

import com.example.supply_dashboard.entity.Shipment;
import com.example.supply_dashboard.repository.ShipmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing Shipment data.
 * This class exposes the /api/shipments endpoint required by the React dashboard.
 */
@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    private final ShipmentRepository shipmentRepository;

    public ShipmentController(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    // GET /api/shipments - Required by the React dashboard for all shipment data
    @GetMapping
    public List<Shipment> getAll() {
        return shipmentRepository.findAll();
    }

    // GET /api/shipments/{id}
    @GetMapping("/{id}")
    public Shipment getById(@PathVariable Long id) {
        return shipmentRepository.findById(id).orElse(null);
    }

    // POST /api/shipments
    @PostMapping
    public Shipment create(@RequestBody Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    // PUT /api/shipments/{id}
    @PutMapping("/{id}")
    public Shipment update(@PathVariable Long id, @RequestBody Shipment shipment) {
        // Ensure the ID is set for the update operation
        shipment.setId(id);
        return shipmentRepository.save(shipment);
    }

    // DELETE /api/shipments/{id}
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        shipmentRepository.deleteById(id);
    }
}
