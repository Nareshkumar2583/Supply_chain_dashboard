package com.example.supply_dashboard.repository;

import com.example.supply_dashboard.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing Shipment entities.
 * Extends JpaRepository to inherit standard CRUD operations.
 */
@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    /**
     * Custom method to find all shipments with a specific status.
     * Spring Data JPA automatically generates the query from the method name.
     * This is useful for dashboard metrics (e.g., "Shipments In Transit").
     *
     * @param status The status string (e.g., "In Transit", "Delivered")
     * @return A list of matching Shipment entities.
     */
    List<Shipment> findByStatus(String status);
}
