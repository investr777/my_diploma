package com.example.juridov.phone.repository;

import com.example.juridov.phone.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    Service findServiceByName(String name);
    Service findServiceById(Long serviceId);
}
