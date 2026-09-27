package com.hbstayevent.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hbstayevent.entity.Hotel;

public interface HotelRepository extends JpaRepository<Hotel, Integer> {

}