package com.example.juridov.phone.service;

import com.example.juridov.phone.entity.Phone;
import com.example.juridov.phone.repository.PhoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhoneService {
    private final PhoneRepository phoneRepository;

    @Autowired
    public PhoneService(PhoneRepository phoneRepository) {
        this.phoneRepository = phoneRepository;
    }

    public List<Phone> getFullListPhoneNumbers() {
        return phoneRepository.findAll();
    }

    public Phone addPhoneNumber(Phone phone) {
        if (phoneRepository.findByPhoneNumber(phone.getPhoneNumber()) != null) {
            return phone;
        }
        return phoneRepository.save(phone);
    }

    public Phone getPhoneNumber(Integer phoneNumber) {
        return phoneRepository.findByPhoneNumber(phoneNumber);
    }

    public void deletePhoneNumber(Long phoneId) {
        Phone phoneFromDB = phoneRepository.findPhoneById(phoneId);
        if (phoneFromDB == null) {
            return;
        }
        phoneRepository.delete(phoneFromDB);
    }

    public Phone updateDataPhone(Phone phone, Long phoneId) {
        Phone phoneFromDB = phoneRepository.findPhoneById(phoneId);
        if (phoneFromDB == null){
            return null;
        }
        if (phone.getPhoneNumber() != null){
            phoneFromDB.setPhoneNumber(phone.getPhoneNumber());
        }
        return phoneRepository.save(phoneFromDB);
    }

    public Phone findPhoneById(Long phoneId) {
        return phoneRepository.findPhoneById(phoneId);
    }

    public Phone checkActiveOrBlock(Integer phoneNumber) {
        Phone phoneFromDB = phoneRepository.findByPhoneNumber(phoneNumber);
        if (phoneFromDB == null) {
            return null;
        }
        if (phoneFromDB.isActive()) {
            phoneFromDB.setActive(false);
        } else {
            phoneFromDB.setActive(true);
        }
        return phoneRepository.save(phoneFromDB);
    }

    public Phone getPhoneByUserId(Long userId) {
        return phoneRepository.findPhoneByUserId(userId);
    }
}