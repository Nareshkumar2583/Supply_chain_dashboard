package com.example.supply_dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {
		"com.example.supply_dashboard.entity"
})
@EnableJpaRepositories(basePackages = {
		"com.example.supply_dashboard.repository"
})

public class SupplyDashboardApplication {

	public static void main(String[] args) {
		SpringApplication.run(SupplyDashboardApplication.class, args);
	}

}
