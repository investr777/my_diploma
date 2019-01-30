package com.example.juridov.phone.bootstrap;

import com.example.juridov.phone.entity.Role;
import com.example.juridov.phone.entity.User;
import com.example.juridov.phone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
public class SpringJpaBootstrap implements ApplicationListener<ContextRefreshedEvent> {

    private final UserRepository userRepository;

    @Autowired
    public SpringJpaBootstrap(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        createData();
    }

    private void createData(){
        //Add admin
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword("admin");
        admin.setRoles(Role.ADMIN);
        userRepository.save(admin);
    }
}
