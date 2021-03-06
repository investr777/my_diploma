package com.example.juridov.phone.entity;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "phone")
@JsonAutoDetect
public class Phone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "phoneNumber", unique = true)
    private String phoneNumber;

    @Column(name = "isActive")
    private boolean isActive = true;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "phone", cascade = CascadeType.REMOVE)
    private List<Journal> journals;

    @JsonIgnore
    @OneToMany(mappedBy = "phone", cascade = CascadeType.REMOVE)
    private List<ServicePhone> servicePhones;

    public List<ServicePhone> getServicePhones() {
        return servicePhones;
    }

    public void setServicePhones(List<ServicePhone> servicePhones) {
        this.servicePhones = servicePhones;
    }

    public List<Journal> getJournals() {
        return journals;
    }

    public void setJournals(List<Journal> journals) {
        this.journals = journals;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
