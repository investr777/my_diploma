package com.example.juridov.phone.controller.admin;

import com.example.juridov.phone.entity.User;
import com.example.juridov.phone.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/admin/users", produces = MediaType.APPLICATION_JSON_VALUE)
//@CrossOrigin(origins = "http://localhost:4200")
@Api(value = "Admin API", tags = "Admin REST Controller API, manage users")
@PreAuthorize("hasAuthority('ADMIN')")
public class UserAdminController {
    private final UserService userService;

    @Autowired
    public UserAdminController(UserService userService) {
        this.userService = userService;
    }

    @ApiOperation(value = "Get list users", response = User.class)
    @RequestMapping(method = RequestMethod.GET)
    public List<User> getListUsers() {
        return userService.getListUsers();
    }

    @ApiOperation(value = "Update Data the user", response = User.class)
    @RequestMapping(path = "/{userId}", method = RequestMethod.PUT)
    public User updateDataUser(@RequestBody User user, @PathVariable Long userId) {
        return userService.updateDataUser(user, userId);
    }
}
