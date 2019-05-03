package com.example.juridov.phone.controller.admin;

import com.example.juridov.phone.entity.Service;
import com.example.juridov.phone.service.ServiceService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/admin/service", produces = MediaType.APPLICATION_JSON_VALUE)
@Api(value = "Admin API", tags = "Admin REST Controller API, manage services")
@PreAuthorize("hasAuthority('ADMIN')")
public class ServiceAdminController {
    private final ServiceService serviceService;

    @Autowired
    public ServiceAdminController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @ApiOperation(value = "Get list services", response = Service.class)
    @RequestMapping(method = RequestMethod.GET)
    public List<Service> getListServices() {
        return serviceService.getFullListService();
    }

    @ApiOperation(value = "Add a new service", response = Service.class)
//    @RequestMapping(path = "/add", method = RequestMethod.POST)
    @PostMapping
    public Service addService(@RequestBody Service service) {
        return serviceService.addService(service);
    }

    @ApiOperation(value = "Update a service", response = Service.class)
    @RequestMapping(path = "/{id}", method = RequestMethod.PUT)
    public Service updateService(@RequestBody Service service, @PathVariable Long id) {
        return serviceService.updateService(service, id);
    }

    @ApiOperation(value = "Delete a service", response = Service.class)
    @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
    public void deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
    }
}