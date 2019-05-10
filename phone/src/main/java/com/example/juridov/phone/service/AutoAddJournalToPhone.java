package com.example.juridov.phone.service;

import com.example.juridov.phone.entity.Journal;
import com.example.juridov.phone.entity.Phone;
import com.example.juridov.phone.entity.ServicePhone;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableScheduling
public class AutoAddJournalToPhone {
    private final PhoneService phoneService;
    private final JournalService journalService;
    private final ServicePhoneService servicePhoneService;

    public AutoAddJournalToPhone(PhoneService phoneService, JournalService journalService, ServicePhoneService servicePhoneService) {
        this.phoneService = phoneService;
        this.journalService = journalService;
        this.servicePhoneService = servicePhoneService;
    }

    private List<Long> phones() {
        List<Phone> phones = phoneService.getFullListPhoneNumbers();
        List<Long> phoneId = new ArrayList<>();
        for (Phone phone : phones) {
            phoneId.add(phone.getId());
        }
        return phoneId;
    }

    private List<List<ServicePhone>> phoneServices(List<Long> phoneId) {
        List<List<ServicePhone>> servicePhones = new ArrayList<>();
        for (Long id : phoneId) {
            servicePhones.add(servicePhoneService.getListOfPhone(id));
        }
        return servicePhones;
    }

    private List<Double> fullPriceOfPhone(List<List<ServicePhone>> servicePhones) {
        List<Double> fullPrice = new ArrayList<>();
        List<Double> prices = new ArrayList<>();
        for (int i = 0; i < servicePhones.size(); i++) {
            for (int j = 0; j < servicePhones.get(i).size(); j++) {
                prices.add(servicePhones.get(i).get(j).getService().getPrice());
            }
            fullPrice.add(prices.stream().mapToDouble(Double::doubleValue).sum());
            prices.clear();
        }
        return fullPrice;
    }

    private void autoAddJournalToPhones() {
        List<Double> prices = fullPriceOfPhone(phoneServices(phones()));
        for (int i = 0; i < prices.size(); i++) {
            Journal journal = new Journal();
            journal.setPrice(prices.get(i));
            journalService.addJournal(journal, Long.valueOf(i + 1));
        }
    }

    @Scheduled(fixedDelay = 60000)
    public void reportCurrentTime() {
        autoAddJournalToPhones();
    }
}
