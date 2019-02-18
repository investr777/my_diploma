package com.example.juridov.phone.service;

import com.example.juridov.phone.entity.Service;
import com.example.juridov.phone.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@org.springframework.stereotype.Service
public class ServiceService {
    private final ServiceRepository serviceRepository;

    @Autowired
    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<Service> getFullListService() {
        return serviceRepository.findAll();
    }

    public Service addService(Service service) {
        if (serviceRepository.findServiceByName(service.getName()) != null) {
            return service;
        }
        return serviceRepository.save(service);
    }

    public Service updateService(Service service, Long serviceId) {
        Service serviceFromDB = serviceRepository.findServiceById(serviceId);
        if (serviceFromDB == null) {
            return null;
        }
        if (service.getName() != null) {
            serviceFromDB.setName(service.getName());
        }
        if (service.getDescription() != null) {
            serviceFromDB.setDescription(service.getDescription());
        }
        if (service.getPrice() > 0.0) {
            serviceFromDB.setPrice(service.getPrice());
        }
        return serviceRepository.save(serviceFromDB);
    }

    public void deleteService(Long serviceId) {
        Service serviceFromDB = serviceRepository.findServiceById(serviceId);
        if (serviceFromDB == null) {
            return;
        }
        serviceRepository.delete(serviceFromDB);
    }
}
