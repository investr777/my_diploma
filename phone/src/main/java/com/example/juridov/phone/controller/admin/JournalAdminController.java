package com.example.juridov.phone.controller.admin;

import com.example.juridov.phone.entity.Journal;
import com.example.juridov.phone.service.JournalService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/admin/journal", produces = MediaType.APPLICATION_JSON_VALUE)
@Api(value = "Admin API", tags = "Admin REST Controller API, manage journals of subscribers")
@PreAuthorize("hasAuthority('ADMIN')")
public class JournalAdminController {
    private final JournalService journalService;

    @Autowired
    public JournalAdminController(JournalService journalService) {
        this.journalService = journalService;
    }

    @ApiOperation(value = "Add a new journal to a phone", response = Journal.class)
    @RequestMapping(path = "/{phoneId}", method = RequestMethod.POST)
    public Journal addJournal(@RequestBody Journal journal, @PathVariable Long phoneId) {
        return journalService.addJournal(journal, phoneId);
    }

    @ApiOperation(value = "Get a journal list of a phone", response = Journal.class)
    @RequestMapping(path = "/{phoneId}", method = RequestMethod.GET)
    public List<Journal> getJournalListPhone(@PathVariable Long phoneId) {
        return journalService.getJournalsOfPhone(phoneId);
    }

    @ApiOperation(value = "Get journals without paid", response = Journal.class)
    @RequestMapping(method = RequestMethod.GET)
    public List<Journal> getNotPaidJournals() {
        return journalService.getNotPaid();
    }

    @ApiOperation(value = "Update a journal", response = Journal.class)
    @RequestMapping(path = "/{journalId}", method = RequestMethod.PUT)
    public Journal updateJournal(@RequestBody Journal journal, @PathVariable Long journalId) {
        return journalService.updateJournal(journal, journalId);
    }

    @ApiOperation(value = "Delete a journal", response = Journal.class)
    @RequestMapping(path = "/{journalId}", method = RequestMethod.DELETE)
    public void deleteJournal(@PathVariable Long journalId) {
        journalService.deleteJournal(journalId);
    }
}