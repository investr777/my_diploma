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

    public List<ServicePhone> getListOfPhone(Long phoneId) {
        return servicePhoneRepository.findAllByPhoneId(phoneId);
    }

    public ServicePhone addServiceToPhone(ServicePhone servicePhone) {
        return servicePhoneRepository.save(servicePhone);
    }

    public void deleteServiceFromPhone(Long servicePhoneId) {
        ServicePhone servicePhoneFromDB = servicePhoneRepository.findServicePhoneById(servicePhoneId);
        if (servicePhoneFromDB == null) {
            return;
        }
        servicePhoneRepository.delete(servicePhoneFromDB);
    }

    public void deleteServicePhone(Long serviceId) {
        List<ServicePhone> servicePhones = getFullListPhoneService();
        for (ServicePhone servicePhone : servicePhones) {
            if (servicePhone.getServiceId() == serviceId) {
                servicePhoneRepository.delete(servicePhone);
            }
        }
    }
}
