package com.example.juridov.phone.dto;

import com.example.juridov.phone.entity.Phone;
import com.example.juridov.phone.entity.User;

public class UserAndPhoneDTO {
    private User user;
    private Phone phone;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Phone getPhone() {
        return phone;
    }

    public void setPhone(Phone phone) {
        this.phone = phone;
    }
}
