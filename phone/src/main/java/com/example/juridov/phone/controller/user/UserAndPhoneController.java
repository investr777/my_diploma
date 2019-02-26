package com.example.juridov.phone.controller.user;

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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/user", produces = MediaType.APPLICATION_JSON_VALUE)
@Api(value = "USER API", description = "User REST Controller API, manage this user and user's phone")
@PreAuthorize("hasAuthority('USER')")
public class UserAndPhoneController {
    private final PhoneService phoneService;
    private final UserService userService;

    @Autowired
    public UserAndPhoneController(PhoneService phoneService, UserService userService) {
        this.phoneService = phoneService;
        this.userService = userService;
    }

    @ApiOperation(value = "Get information about this user", response = UserAndPhoneDTO.class)
    @RequestMapping(method = RequestMethod.GET)
    public UserAndPhoneDTO getInformation(@AuthenticationPrincipal User user) {
        UserAndPhoneDTO userAndPhoneDTO = new UserAndPhoneDTO();
        userAndPhoneDTO.setUser(userService.getUser(user.getId()));
        userAndPhoneDTO.setPhone(phoneService.getPhoneByUser(user.getId()));
        return userAndPhoneDTO;
    }

    @ApiOperation(value = "Edit password of the user", response = User.class)
    @RequestMapping(path = "/edit",method = RequestMethod.PUT)
    public User editPasswordUser(@AuthenticationPrincipal User user, @RequestParam String password, @RequestParam String oldPassword) throws Exception {
        return userService.updateUserPassword(password, oldPassword, user.getId());
    }


}
