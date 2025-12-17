
package com.example.supply_dashboard.controller;

import com.example.supply_dashboard.entity.Item;
import com.example.supply_dashboard.repository.ItemRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemRepository itemRepository;

    public ItemController(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    // Get all items
    @GetMapping
    public List<Item> getAll() {
        return itemRepository.findAll();
    }

    // Get item by ID
    @GetMapping("/{id}")
    public Item getById(@PathVariable Long id) {
        return itemRepository.findById(id).orElse(null);
    }

    // Create new item
    @PostMapping
    public Item create(@RequestBody Item item) {
        return itemRepository.save(item);
    }

    // Update item
    @PutMapping("/{id}")
    public Item update(@PathVariable Long id, @RequestBody Item item) {
        item.setId(id);
        return itemRepository.save(item);
    }

    // Delete item
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        itemRepository.deleteById(id);
    }
}
