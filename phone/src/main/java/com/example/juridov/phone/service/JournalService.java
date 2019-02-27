package com.example.juridov.phone.service;

import com.example.juridov.phone.entity.Journal;
import com.example.juridov.phone.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JournalService {
    private final JournalRepository journalRepository;

    @Autowired
    public JournalService(JournalRepository journalRepository) {
        this.journalRepository = journalRepository;
    }

    public List<Journal> getJournalsOfPhone(Long phoneId) {
        return journalRepository.findAllByPhoneId(phoneId);
    }

    public List<Journal> getNotPaid() {
        List<Journal> notPaid = new ArrayList<>();
        List<Journal> listFromDB = journalRepository.findAll();
        for (Journal journal : listFromDB) {
            if (!journal.isPaid()) {
                notPaid.add(journal);
            }
        }
        return notPaid;
    }

    public List<Journal> getNotPaidByPhone(Long phoneId) {
        List<Journal> notPaidByPhone = new ArrayList<>();
        for (Journal journal : getNotPaid()) {
            if (journal.getPhoneId() == phoneId) {
                notPaidByPhone.add(journal);
            }
        }
        return notPaidByPhone;
    }

    public Journal addJournal(Journal journal, Long phoneId) {
        journal.setPhoneId(phoneId);
        return journalRepository.save(journal);
    }

    public Journal updateJournal(Journal journal, Long journalId) {
        Journal journalFromDB = journalRepository.findJournalById(journalId);
        if (journalFromDB == null) {
            return null;
        }
        if (journal.getFromDate() != null) {
            journalFromDB.setFromDate(journal.getFromDate());
        }
        if (journal.getToDate() != null) {
            journalFromDB.setToDate(journal.getToDate());
        }
        if (journal.getPrice() > 0.0) {
            journalFromDB.setPrice(journal.getPrice());
        }
        return journalRepository.save(journalFromDB);
    }

    public Journal setIsPaid(Long journalId, Long phoneId) {
        Journal journalFromDB = journalRepository.findJournalById(journalId);
        if (journalFromDB.getPhoneId() == phoneId) {
            if (journalFromDB == null) {
                return null;
            }
            if (!journalFromDB.isPaid()) {
                journalFromDB.setPaid(true);
            }
        } else {
            return null;
        }
        return journalRepository.save(journalFromDB);
    }

    public void deleteJournal(Long journalId) {
        journalRepository.delete(journalRepository.findJournalById(journalId));
    }
}
