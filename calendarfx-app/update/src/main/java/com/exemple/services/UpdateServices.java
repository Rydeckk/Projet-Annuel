package com.exemple.services;

import com.exemple.model.Update;

import java.util.List;

public interface UpdateServices {
    List<Update> getAllUpdates();

    Update createUpdate(Update update);

    Update getUpdate(Long id);

    void deleteUpdate(Long id);

    Update getActiveVersion();

    boolean isActive(String version);
}
