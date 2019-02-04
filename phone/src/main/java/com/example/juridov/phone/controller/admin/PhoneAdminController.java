package com.example.juridov.phone.controller.admin;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/admin", produces = MediaType.APPLICATION_JSON_VALUE)
@Api(value = "Admin API", description = "Admin REST Controller API, manage phone numbers and subscribers")
@PreAuthorize("hasAuthority('ADMIN')")
public class PhoneAdminController {
    private final UserService userService;
    private final PhoneService phoneService;

    @Autowired
    public PhoneAdminController(UserService userService, PhoneService phoneService) {
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
    @RequestMapping(method = RequestMethod.GET)
    public List<Phone> getListPhoneNumber() {
        return phoneService.getFullListPhoneNumbers();
    }

    @ApiOperation(value = "Block phone or Active phone", response = Phone.class)
    @RequestMapping(method = RequestMethod.PUT)
    public Phone blockOrActivePhone(int phoneNumber) {
        return phoneService.checkActiveOrBlock(phoneNumber);
    }

    @ApiOperation(value = "Find by phone number", response = Phone.class)
    @RequestMapping(path = "/findByPhone", method = RequestMethod.GET)
    public Phone findByPhoneNumber(int phoneNumber) {
        return phoneService.getPhoneNumber(phoneNumber);
    }

    @ApiOperation(value = "Delete phone number", response = Phone.class)
    @RequestMapping(path = "/delete", method = RequestMethod.DELETE)
    public void deletePhoneNumber(int phoneNumber) {
        phoneService.deletePhoneNumber(phoneNumber);
    }
}
