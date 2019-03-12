package com.example.juridov.phone.repository;

import com.example.juridov.phone.entity.Phone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhoneRepository extends JpaRepository<Phone, Long> {
    Phone findByPhoneNumber(int phoneNumber);
    Phone findPhoneByUserId(Long userId);
    Phone findPhoneById(Long phoneId);
}
