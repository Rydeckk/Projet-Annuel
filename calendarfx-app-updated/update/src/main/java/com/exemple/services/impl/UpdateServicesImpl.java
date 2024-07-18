package com.exemple.services.impl;

import com.exemple.repository.UpdateRepository;
import com.exemple.model.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UpdateServicesImpl implements com.exemple.services.UpdateServices {
    private UpdateRepository updateRepository;
    @Autowired
    public UpdateServicesImpl(UpdateRepository updateRepository){
        this.updateRepository = updateRepository;
    }

    @Override
    public List<Update> getAllUpdates(){
        return (List<Update>)updateRepository.findAll();
    }

    @Override
    public Update createUpdate(Update update){
        return updateRepository.save(update);
    }

    @Override
    public Update getUpdate(Long id){
        return updateRepository.findById(id).orElse(null);
    }

    @Override
    public Update getActiveVersion() {
        return updateRepository.findByActive(true);
    }

    @Override
    public void deleteUpdate(Long id){
        updateRepository.deleteById(id);
    }

    @Override
    public boolean isActive(String version) {
        return updateRepository.findByActive(true).getNumeroVersion().equals(version);
    }
}
