package com.example.juridov.phone.controller.user;

import com.example.juridov.phone.entity.Service;
import com.example.juridov.phone.entity.ServicePhone;
import com.example.juridov.phone.entity.User;
import com.example.juridov.phone.service.PhoneService;
import com.example.juridov.phone.service.ServicePhoneService;
import com.example.juridov.phone.service.ServiceService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/user/service", produces = MediaType.APPLICATION_JSON_VALUE)
@Api(value = "USER API", tags = "User REST Controller API, manage services of this phone")
@PreAuthorize("hasAuthority('USER')")
public class ServicePhoneUserController {
    private final ServicePhoneService servicePhoneService;
    private final PhoneService phoneService;
    private final ServiceService serviceService;

    @Autowired
    public ServicePhoneUserController(ServicePhoneService servicePhoneService, PhoneService phoneService, ServiceService serviceService) {
        this.servicePhoneService = servicePhoneService;
        this.phoneService = phoneService;
        this.serviceService = serviceService;
    }

    @ApiOperation(value = "Get full list of services", response = ServicePhone.class)
    @RequestMapping(path = "/services", method = RequestMethod.GET)
    public List<Service> getServices() {
        return serviceService.getFullListService();
    }

    @ApiOperation(value = "Get a list services of this phone number", response = ServicePhone.class)
    @RequestMapping(method = RequestMethod.GET)
    public List<ServicePhone> getInformation(@AuthenticationPrincipal User user) {
        Long phoneId = phoneService.getPhoneByUserId(user.getId()).getId();
        return servicePhoneService.getListOfPhone(phoneId);
    }

    @ApiOperation(value = "Add a new service to this phone", response = ServicePhone.class)
    @RequestMapping(path = "/{serviceId}", method = RequestMethod.POST)
    public ServicePhone addServiceToPhone(@AuthenticationPrincipal User user, @PathVariable Long serviceId) throws Exception {
        Long phoneId = phoneService.getPhoneByUserId(user.getId()).getId();
        return servicePhoneService.addServiceToPhone(phoneId, serviceId);
    }

    @ApiOperation(value = "Delete a service from this phone", response = ServicePhone.class)
    @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
    public void deleteServiceFromPhone(@AuthenticationPrincipal User user, @PathVariable Long id) {
        Long phoneId = phoneService.getPhoneByUserId(user.getId()).getId();
        servicePhoneService.deleteServiceFromPhone(id, phoneId);
    }
}
