package com.example.juridov.phone.service;

import com.example.juridov.phone.entity.User;
import com.example.juridov.phone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

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
            } else {
                throw new Exception("Wrong old password!");
            }
        }
        return userRepository.save(userFromDB);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username);
    }
}
