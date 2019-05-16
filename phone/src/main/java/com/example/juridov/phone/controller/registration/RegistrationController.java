package com.example.juridov.phone.controller.registration;

import com.example.juridov.phone.entity.Phone;
import com.example.juridov.phone.entity.User;
import com.example.juridov.phone.service.PhoneService;
import com.example.juridov.phone.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/registration", produces = MediaType.APPLICATION_JSON_VALUE)
@Api(value = "USER API", tags = "Registration REST Controller API, registration a new user")
public class RegistrationController {
    private final UserService userService;
    private final PhoneService phoneService;

    public RegistrationController(UserService userService, PhoneService phoneService) {
        this.userService = userService;
        this.phoneService = phoneService;
    }

    @ApiOperation(value = "Registration a new user", response = User.class)
    @PostMapping
    public Phone addNewUser(@RequestBody Phone phone) {
        userService.addUser(phone.getUser());
        return phoneService.addPhoneNumber(phone);
    }

    @GetMapping("/activate/{code}")
    public void activate(@PathVariable String code){
        userService.activateUser(code);
    }

}
