package com.example.juridov.phone.controller;

import com.example.juridov.phone.dto.UserAndPhoneDTO;
import com.example.juridov.phone.entity.Phone;
import com.example.juridov.phone.entity.User;
import com.example.juridov.phone.service.PhoneService;
import com.example.juridov.phone.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/admin", produces = MediaType.APPLICATION_JSON_VALUE)
@Api(value = "Admin API", description = "Admin REST Controller API, registration a new subscriber")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {
    private final UserService userService;
    private final PhoneService phoneService;

    @Autowired
    public AdminController(UserService userService, PhoneService phoneService) {
        this.userService = userService;
        this.phoneService = phoneService;
    }

    @ApiOperation(value = "Registration a new subscriber with his phone number", response = User.class)
    @RequestMapping(path = "/registration", method = RequestMethod.POST)
    public void addNewSubscriberWithPhone(@RequestBody UserAndPhoneDTO userAndPhoneDTO) {
        Long userId = userService.addUser(userAndPhoneDTO.getUser()).getId();
        userAndPhoneDTO.getPhone().setUserId(userId);
        phoneService.addPhoneNumber(userAndPhoneDTO.getPhone());
    }

    @ApiOperation(value = "Get list of a phone number with his subscriber", response = User.class)
    @GetMapping
    public List<Phone> getListPhoneNumber() {
        return phoneService.getFullListPhoneNumbers();
    }
}
