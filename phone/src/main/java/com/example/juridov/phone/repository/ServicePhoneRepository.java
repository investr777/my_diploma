package com.example.juridov.phone.repository;

import com.example.juridov.phone.entity.ServicePhone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicePhoneRepository extends JpaRepository<ServicePhone, Long> {
    List<ServicePhone> findAllByPhoneId(Long phoneId);
    ServicePhone findServicePhoneById(Long phoneServiceId);
}
