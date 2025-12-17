package com.example.supply_dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com. example. supply_dashboard. entity. Item;

public interface ItemRepository extends JpaRepository<Item,Long> {
}
