package com.example.juridov.phone.controller.anonymus;

import com.example.juridov.phone.entity.Service;
import com.example.juridov.phone.service.ServiceService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/services", produces = MediaType.APPLICATION_JSON_VALUE)
public class ServiceController {
    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Service> getListServices() {
        return serviceService.getFullListService();
    }
}
