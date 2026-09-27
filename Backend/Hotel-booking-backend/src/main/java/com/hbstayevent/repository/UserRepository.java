package com.hbstayevent.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hbstayevent.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email);
}