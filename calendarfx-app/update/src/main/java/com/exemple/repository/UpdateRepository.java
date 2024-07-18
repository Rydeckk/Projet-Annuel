package com.exemple.repository;

import com.exemple.model.Update;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UpdateRepository extends CrudRepository<Update, Long> {

    @Cacheable
    Update findByActive(boolean active);
}
