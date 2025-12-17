package com.example.supply_dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com. example. supply_dashboard. entity. Warehouse;
import org.springframework.stereotype.Repository;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse,Long> {
}
