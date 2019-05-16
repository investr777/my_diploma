package com.example.juridov.phone.repository;

import com.example.juridov.phone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String name);
    User findUserById(Long userId);

    User findByActivationCode(String code);
}
