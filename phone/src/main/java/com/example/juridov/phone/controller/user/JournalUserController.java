package com.example.juridov.phone.controller.user;

import com.example.juridov.phone.entity.Journal;
import com.example.juridov.phone.entity.User;
import com.example.juridov.phone.service.JournalService;
import com.example.juridov.phone.service.PhoneService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/user/journal", produces = MediaType.APPLICATION_JSON_VALUE)
@Api(value = "USER API", description = "User REST Controller API, manage journals of this user")
@PreAuthorize("hasAuthority('USER')")
public class JournalUserController {
    private final JournalService journalService;
    private final PhoneService phoneService;

    @Autowired
    public JournalUserController(JournalService journalService, PhoneService phoneService) {
        this.journalService = journalService;
        this.phoneService = phoneService;
    }

    @ApiOperation(value = "Get a journal list of this phone", response = Journal.class)
    @RequestMapping(method = RequestMethod.GET)
    public List<Journal> getListJournal(@AuthenticationPrincipal User user) {
        Long phoneId = phoneService.getPhoneByUser(user.getId()).getId();
        return journalService.getJournalsOfPhone(phoneId);
    }
}
