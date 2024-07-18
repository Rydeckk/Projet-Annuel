
package com.exemple.controller;

import com.exemple.model.Update;
import com.exemple.services.UpdateServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/updates")
public class UpdateController {
    private final UpdateServices updateServices;

    @Autowired
    public UpdateController(UpdateServices updateServices) {
        this.updateServices = updateServices;
    }

    @GetMapping
    public List<Update> getAllUpdates() {
        return updateServices.getAllUpdates();
    }

    @GetMapping("/{id}")
    public Update getUpdateById(@PathVariable Long id) {
        return updateServices.getUpdate(id);
    }

    @PostMapping
    public Update createUpdate(@RequestBody Update update) {
        return updateServices.createUpdate(update);
    }

    @DeleteMapping("/{id}")
    public void deleteUpdate(@PathVariable Long id) {
        updateServices.deleteUpdate(id);
    }
}
