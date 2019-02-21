package com.example.juridov.phone.service;

import com.example.juridov.phone.entity.ServicePhone;
import com.example.juridov.phone.repository.ServicePhoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicePhoneService {
    private final ServicePhoneRepository servicePhoneRepository;

    @Autowired
    public ServicePhoneService(ServicePhoneRepository servicePhoneRepository) {
        this.servicePhoneRepository = servicePhoneRepository;
    }

    public List<ServicePhone> getFullListPhoneService() {
        return servicePhoneRepository.findAll();
    }


}
