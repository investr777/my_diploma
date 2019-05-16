package com.example.juridov.phone.bootstrap;

import com.example.juridov.phone.entity.*;
import com.example.juridov.phone.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

@Component
public class SpringJpaBootstrap implements ApplicationListener<ContextRefreshedEvent> {
    private final UserRepository userRepository;
    private final PhoneRepository phoneRepository;
    private final JournalRepository journalRepository;
    private final ServiceRepository serviceRepository;
    private final ServicePhoneRepository servicePhoneRepository;

    @Autowired
    public SpringJpaBootstrap(UserRepository userRepository, PhoneRepository phoneRepository, JournalRepository journalRepository, ServiceRepository serviceRepository, ServicePhoneRepository servicePhoneRepository) {
        this.userRepository = userRepository;
        this.phoneRepository = phoneRepository;
        this.journalRepository = journalRepository;
        this.serviceRepository = serviceRepository;
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
        user1.setActive(true);
        user1.setEmail("user1@user.ru");
        user1.setRole(Role.USER);
        userRepository.save(user1);
        Phone phone1 = new Phone();
        phone1.setUser(user1);
        phone1.setPhoneNumber(663540);
        phone1.setActive(true);
        phoneRepository.save(phone1);

        //Add second subscriber
        User user2 = new User();
        user2.setUsername("user2");
        user2.setPassword("222");
        user2.setFullName("Petrov Kirill Olegovich");
        user2.setAddress("Vitebsk, st. Chkalova 5-112");
        user2.setActive(true);
        user2.setEmail("user2@user.ru");
        user2.setRole(Role.USER);
        userRepository.save(user2);
        Phone phone2 = new Phone();
        phone2.setUser(user2);
        phone2.setPhoneNumber(332478);
        phone2.setActive(true);
        phoneRepository.save(phone2);

        //Add third subscriber
        User user3 = new User();
        user3.setUsername("user3");
        user3.setPassword("333");
        user3.setFullName("El'nikova Marina Vladimirovna");
        user3.setAddress("Vitebsk, st. Titovs 76-1-2");
        user3.setActive(true);
        user3.setEmail("user3@user.ru");
        user3.setRole(Role.USER);
        userRepository.save(user3);
        Phone phone3 = new Phone();
        phone3.setUser(user3);
        phone3.setPhoneNumber(541236);
        phone3.setActive(true);
        phoneRepository.save(phone3);

        //Add first journal
        Journal journal1 = new Journal();
        journal1.setPhone(phone1);
        journal1.setPaid(true);
        journal1.setPeriod(new GregorianCalendar(2019, Calendar.JANUARY,25).getTime());
        journal1.setPrice(2.5);
        journalRepository.save(journal1);

        //Add second journal
        Journal journal2 = new Journal();
        journal2.setPhone(phone1);
        journal2.setPaid(false);
        journal2.setPeriod(new GregorianCalendar(2019, Calendar.FEBRUARY,25).getTime());
        journal2.setPrice(3.6);
        journalRepository.save(journal2);

        //Add third journal
        Journal journal3 = new Journal();
        journal3.setPhone(phone2);
        journal3.setPaid(false);
        journal3.setPeriod(new GregorianCalendar(2019, Calendar.MARCH,25).getTime());
        journal3.setPrice(1.1);
        journalRepository.save(journal3);

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
        service3.setPrice(3.0);
        serviceRepository.save(service3);

        //Add first servicePhone
        ServicePhone servicePhone1 = new ServicePhone();
        servicePhone1.setPhone(phone1);
        servicePhone1.setService(service1);
        servicePhoneRepository.save(servicePhone1);

        //Add first servicePhone
        ServicePhone servicePhone2 = new ServicePhone();
        servicePhone2.setPhone(phone1);
        servicePhone2.setService(service2);
        servicePhoneRepository.save(servicePhone2);

        //Add first servicePhone
        ServicePhone servicePhone3 = new ServicePhone();
        servicePhone3.setPhone(phone2);
        servicePhone3.setService(service3);
        servicePhoneRepository.save(servicePhone3);
    }
}
