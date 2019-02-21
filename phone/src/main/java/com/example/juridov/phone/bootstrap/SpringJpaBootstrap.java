package com.example.juridov.phone.bootstrap;

import com.example.juridov.phone.entity.*;
import com.example.juridov.phone.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
public class SpringJpaBootstrap implements ApplicationListener<ContextRefreshedEvent> {
    private final UserRepository userRepository;
    private final PhoneRepository phoneRepository;
    private final ServiceRepository serviceRepository;
    private final JournalRepository journalRepository;
    private final ServicePhoneRepository servicePhoneRepository;

    @Autowired
    public SpringJpaBootstrap(UserRepository userRepository, PhoneRepository phoneRepository, ServiceRepository serviceRepository, JournalRepository journalRepository, ServicePhoneRepository servicePhoneRepository) {
        this.userRepository = userRepository;
        this.phoneRepository = phoneRepository;
        this.serviceRepository = serviceRepository;
        this.journalRepository = journalRepository;
        this.servicePhoneRepository = servicePhoneRepository;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        createData();
    }

    private void createData() {
        //Add admin
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword("admin");
        admin.setAddress("company \"Miron phone\"");
        admin.setFullName("admin");
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        //Add first subscriber
        User user1 = new User();
        user1.setUsername("user1");
        user1.setPassword("111");
        user1.setFullName("Egorov Aleksandr Petrovich");
        user1.setAddress("Vitebsk, pr-t Chernyahovskogo 6-18");
        user1.setRole(Role.USER);
        Long user1Id = userRepository.save(user1).getId();
        Phone phone1 = new Phone();
        phone1.setUserId(user1Id);
        phone1.setPhoneNumber(663540);
        phone1.setActive(true);
        phoneRepository.save(phone1);

        //Add second subscriber
        User user2 = new User();
        user2.setUsername("user2");
        user2.setPassword("222");
        user2.setFullName("Petrov Kirill Olegovich");
        user2.setAddress("Vitebsk, st. Chkalova 5-112");
        user2.setRole(Role.USER);
        Long user2Id = userRepository.save(user2).getId();
        Phone phone2 = new Phone();
        phone2.setUserId(user2Id);
        phone2.setPhoneNumber(332478);
        phone2.setActive(true);
        phoneRepository.save(phone2);

        //Add third subscriber
        User user3 = new User();
        user3.setUsername("user3");
        user3.setPassword("333");
        user3.setFullName("El'nikova Marina Vladimirovna");
        user3.setAddress("Vitebsk, st. Titovs 76-1-2");
        user3.setRole(Role.USER);
        Long user3Id = userRepository.save(user3).getId();
        Phone phone3 = new Phone();
        phone3.setUserId(user3Id);
        phone3.setPhoneNumber(541236);
        phone3.setActive(true);
        phoneRepository.save(phone3);

        //Add first service
        Service service1 = new Service();
        service1.setName("ANI");
        service1.setDescription("ANI is automatic number identifier");
        service1.setPrice(1.1);
        serviceRepository.save(service1);

        //Add second service
        Service service2 = new Service();
        service2.setName("Melody");
        service2.setDescription("Melody instead of beeps");
        service2.setPrice(2.5);
        serviceRepository.save(service2);

        //Add third service
        Service service3 = new Service();
        service3.setName("Hidden number");
        service3.setDescription("Unknown number");
        service3.setPrice(2.5);
        serviceRepository.save(service3);

        //Add first journal
        Journal journal1 = new Journal();
        journal1.setPhoneId(1L);
        journal1.setPaid(true);
        journal1.setFromDate(1546300800000L);
        journal1.setToDate(1548892800000L);
        journal1.setPrice(2.5);
        journalRepository.save(journal1);

        //Add second journal
        Journal journal2 = new Journal();
        journal2.setPhoneId(1L);
        journal2.setPaid(false);
        journal2.setFromDate(1548979200000L);
        journal2.setToDate(1551312000000L);
        journal2.setPrice(3.6);
        journalRepository.save(journal2);

        //Add third journal
        Journal journal3 = new Journal();
        journal3.setPhoneId(2L);
        journal3.setPaid(false);
        journal3.setFromDate(1546300800000L);
        journal3.setToDate(1548892800000L);
        journal3.setPrice(1.1);
        journalRepository.save(journal3);

        //Add first servicePhone
        ServicePhone servicePhone1 = new ServicePhone();
        servicePhone1.setPhoneId(1L);
        servicePhone1.setServiceId(1L);
        servicePhoneRepository.save(servicePhone1);

        //Add first servicePhone
        ServicePhone servicePhone2 = new ServicePhone();
        servicePhone2.setPhoneId(1L);
        servicePhone2.setServiceId(2L);
        servicePhoneRepository.save(servicePhone2);

        //Add first servicePhone
        ServicePhone servicePhone3 = new ServicePhone();
        servicePhone3.setPhoneId(2L);
        servicePhone3.setServiceId(3L);
        servicePhoneRepository.save(servicePhone3);
    }
}
