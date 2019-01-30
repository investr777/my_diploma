package com.example.juridov.phone.controller;

import com.example.juridov.phone.entity.User;
import com.example.juridov.phone.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(value = "User API", description = "User REST Controller API, registration a new user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @ApiOperation(value = "Registration a new user", response = User.class)
    @PostMapping(path = "/registration")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void addUser(@RequestBody User user) {
        userService.addUser(user);
    }

    @GetMapping(path = "/get")
    public Iterable<User> getUsers (){
        return userService.getUsers();
    }
}
