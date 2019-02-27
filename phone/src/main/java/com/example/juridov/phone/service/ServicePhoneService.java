package com.example.juridov.phone.service;

import com.example.juridov.phone.entity.ServicePhone;
import com.example.juridov.phone.repository.ServicePhoneRepository;
import com.example.juridov.phone.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicePhoneService {
    private final ServicePhoneRepository servicePhoneRepository;
    private final ServiceRepository serviceRepository;

    @Autowired
    public ServicePhoneService(ServicePhoneRepository servicePhoneRepository, ServiceRepository serviceRepository) {
        this.servicePhoneRepository = servicePhoneRepository;
        this.serviceRepository = serviceRepository;
    }

    public List<ServicePhone> getFullListPhoneService() {
        return servicePhoneRepository.findAll();
    }

    public List<ServicePhone> getListOfPhone(Long phoneId) {
        return servicePhoneRepository.findAllByPhoneId(phoneId);
    }

    public ServicePhone addServiceToPhone(Long phoneId, Long serviceId) throws Exception {
        if (serviceRepository.findServiceById(serviceId) == null) {
            return null;
        }
        for (ServicePhone servicePhone : servicePhoneRepository.findAllByPhoneId(phoneId)) {
            if (servicePhone.getServiceId() == serviceId) {
                throw new Exception("Already connected");
            }
        }
        ServicePhone servicePhone = new ServicePhone();
        servicePhone.setPhoneId(phoneId);
        servicePhone.setServiceId(serviceId);
        return servicePhoneRepository.save(servicePhone);
    }

    public void deleteServiceFromPhone(Long servicePhoneId, Long phoneId) {
        ServicePhone servicePhoneFromDB = servicePhoneRepository.findServicePhoneById(servicePhoneId);
        if (servicePhoneFromDB == null) {
            return;
        }
        for (ServicePhone servicePhone : servicePhoneRepository.findAllByPhoneId(phoneId)) {
            if (servicePhone.getId() == servicePhoneId) {
                servicePhoneRepository.delete(servicePhoneFromDB);
            }
        }
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
