package com.example.supply_dashboard.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * Represents a record in the 'shipment' table, inferred from the MySQL schema
 * and necessary to support the /api/shipments endpoint used by the React dashboard.
 */
@Entity
@Data

@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Establishing the link to the Order that this shipment fulfills
    // Matches the FOREIGN KEY(order_id) in the SQL schema.
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private OrderEntity order;

    private String originLocation;
    private String destinationLocation;

    // Use LocalDate for date fields to correctly map to SQL DATE types
    private LocalDate shipmentDate;
    private LocalDate estimatedDeliveryDate;

    // Status can be 'In Transit', 'Delivered', 'Delayed', 'Pending'
    private String status;
}
