package com.example.juridov.phone.service;

import com.example.juridov.phone.entity.Journal;
import com.example.juridov.phone.repository.JournalRepository;
import com.example.juridov.phone.repository.PhoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class JournalService {
    private final JournalRepository journalRepository;
    private final PhoneRepository phoneRepository;

    @Autowired
    public JournalService(JournalRepository journalRepository, PhoneRepository phoneRepository) {
        this.journalRepository = journalRepository;
        this.phoneRepository = phoneRepository;
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

    public List<Journal> getPaid() {
        List<Journal> paid = new ArrayList<>();
        List<Journal> listFromDB = journalRepository.findAll();
        for (Journal journal : listFromDB) {
            if (journal.isPaid()) {
                paid.add(journal);
            }
        }
        return paid;
    }

    public List<Journal> getNotPaidByPhone(Long phoneId) {
        List<Journal> notPaidByPhone = new ArrayList<>();
        for (Journal journal : getNotPaid()) {
            if (journal.getPhone().getId() == phoneId) {
                notPaidByPhone.add(journal);
            }
        }
        return notPaidByPhone;
    }

    public List<Journal> getPaidByPhone(Long phoneId) {
        List<Journal> paidByPhone = new ArrayList<>();
        for (Journal journal : getPaid()) {
            if (journal.getPhone().getId() == phoneId) {
                paidByPhone.add(journal);
            }
        }
        return paidByPhone;
    }

    public Journal addJournal(Journal journal, Long phoneId) {
        journal.setPhone(phoneRepository.findPhoneById(phoneId));
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, -1);
        journal.setPeriod(calendar.getTime());
        if (journal.getPrice() > 0.0) {
            return journalRepository.save(journal);
        }
        return null;
    }

    public Journal updateJournal(Journal journal, Long journalId) {
        Journal journalFromDB = journalRepository.findJournalById(journalId);
        if (journalFromDB == null) {
            return null;
        }
        if (journal.getPrice() > 0.0) {
            journalFromDB.setPrice(journal.getPrice());
        }
        return journalRepository.save(journalFromDB);
    }

    public Journal setIsPaid(Long journalId, Long phoneId) {
        Journal journalFromDB = journalRepository.findJournalById(journalId);
        if (journalFromDB.getPhone().getId() == phoneId) {
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
