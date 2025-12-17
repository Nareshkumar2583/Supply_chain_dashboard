package com.example.supply_dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com. example.supply_dashboard.entity. User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUsername(String username);
}
