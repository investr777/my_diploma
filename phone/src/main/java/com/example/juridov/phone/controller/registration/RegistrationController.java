package com.example.juridov.phone.controller.registration;

import com.example.juridov.phone.entity.Phone;
import com.example.juridov.phone.entity.User;
import com.example.juridov.phone.service.PhoneService;
import com.example.juridov.phone.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
@Api(value = "Registration API", tags = "Registration REST Controller API, registration a new user")
public class RegistrationController {
    private final UserService userService;
    private final PhoneService phoneService;

    public RegistrationController(UserService userService, PhoneService phoneService) {
        this.userService = userService;
        this.phoneService = phoneService;
    }

    @ApiOperation(value = "Activate code", response = User.class)
    @RequestMapping(value = "/activate/{code}",method = RequestMethod.GET)
    public boolean activate(@PathVariable String code){
        return userService.activateUser(code);
    }

    @ApiOperation(value = "Phone available list", response = Phone.class)
    @RequestMapping(value = "/phones",method = RequestMethod.GET)
    public List<Phone> phoneListWithoutUser(){
        List<Phone> phoneList = new ArrayList<>();
        for (Phone phone : phoneService.findAll()){
            if (phone.getUser() == null) {
                phoneList.add(phone);
            }
        }
        return phoneList;
    }

    @ApiOperation(value = "Registration a new user", response = Phone.class)
    @PostMapping(value = "/registration")
    public Phone EditSubscriberWithPhone(@RequestBody Phone phone) {
        User user = userService.addUser(phone.getUser());
        phone.setUser(user);
        return phoneService.updateDataPhone(phone, phone.getId());
    }
}
