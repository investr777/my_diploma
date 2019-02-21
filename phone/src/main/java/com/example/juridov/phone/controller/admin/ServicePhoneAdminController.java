package com.example.juridov.phone.controller.admin;

import com.example.juridov.phone.entity.ServicePhone;
import com.example.juridov.phone.service.ServicePhoneService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/admin/servicePhone", produces = MediaType.APPLICATION_JSON_VALUE)
@Api(value = "Admin API", description = "Admin REST Controller API, show services of phone numbers")
@PreAuthorize("hasAuthority('ADMIN')")
public class ServicePhoneAdminController {
    private final ServicePhoneService servicePhoneService;

    @Autowired
    public ServicePhoneAdminController(ServicePhoneService servicePhoneService) {
        this.servicePhoneService = servicePhoneService;
    }

    @ApiOperation(value = "Get a full list srvices of phone numbers", response = ServicePhone.class)
    @RequestMapping(method = RequestMethod.GET)
    public List<ServicePhone> getFullList() {
        return servicePhoneService.getFullListPhoneService();
    }
}
