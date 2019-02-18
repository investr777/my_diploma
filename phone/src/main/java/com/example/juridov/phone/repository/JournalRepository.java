package com.example.juridov.phone.repository;


import com.example.juridov.phone.entity.Journal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JournalRepository extends JpaRepository<Journal, Long> {
    Journal findJournalById(Long journalId);
    List<Journal> findAllByPhoneId(Long phoneId);
}
