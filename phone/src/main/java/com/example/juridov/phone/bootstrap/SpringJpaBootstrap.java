package com.example.juridov.phone.bootstrap;

import com.example.juridov.phone.entity.Phone;
import com.example.juridov.phone.entity.Role;
import com.example.juridov.phone.entity.Service;
import com.example.juridov.phone.entity.User;
import com.example.juridov.phone.repository.PhoneRepository;
import com.example.juridov.phone.repository.ServiceRepository;
import com.example.juridov.phone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
public class SpringJpaBootstrap implements ApplicationListener<ContextRefreshedEvent> {
    private final UserRepository userRepository;
    private final PhoneRepository phoneRepository;
    private final ServiceRepository serviceRepository;

    @Autowired
    public SpringJpaBootstrap(UserRepository userRepository, PhoneRepository phoneRepository, ServiceRepository serviceRepository) {
        this.userRepository = userRepository;
        this.phoneRepository = phoneRepository;
        this.serviceRepository = serviceRepository;
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
        service1.setName("ani");
        service1.setDescription("ani is automatic number identifier");
        service1.setPrice(1.1);
        serviceRepository.save(service1);
    }
}
