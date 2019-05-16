package com.example.juridov.phone.service;

import com.example.juridov.phone.entity.User;
import com.example.juridov.phone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    @Autowired
    private MailSender mailSender;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getListUsers() {
        return userRepository.findAll();
    }

    public User getUser(Long userId) {
        return userRepository.findUserById(userId);
    }

    public User addUser(User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return user;
        }
        user.setActivationCode(UUID.randomUUID().toString());
        if (!StringUtils.isEmpty(user.getEmail())) {
            String message = String.format(
                    "Hello, %s! \n" +
                            "Welcome to Miron Phone. Please, visit next link: http://localhost:8080/activate/%s",
                    user.getUsername(),
                    user.getActivationCode()
            );
            mailSender.send(user.getEmail(), "Activation code", message);
        }
        return userRepository.save(user);
    }

    public User updateDataUser(User user, Long userId) {
        User userFromDB = userRepository.findUserById(userId);
        if (userFromDB == null) {
            return null;
        }
        if (user.getFullName() != null) {
            userFromDB.setFullName(user.getFullName());
        }
        if (user.getAddress() != null) {
            userFromDB.setAddress(user.getAddress());
        }
        return userRepository.save(userFromDB);
    }

    public User updateUserPassword(String password, String oldPassword, Long userId) throws Exception {
        User userFromDB = userRepository.findUserById(userId);
        if (userFromDB == null) {
            return null;
        }
        if (password != null) {
            if (BCrypt.checkpw(oldPassword, userFromDB.getPassword())) {
                userFromDB.setPassword(password);
            }
        }
        return userRepository.save(userFromDB);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username);
    }

    public boolean activateUser(String code) {
        User user = userRepository.findByActivationCode(code);
        if (user == null){
            return false;
        }

        user.setActivationCode(null);
        user.setActive(true);

        userRepository.save(user);

        return true;
    }
}