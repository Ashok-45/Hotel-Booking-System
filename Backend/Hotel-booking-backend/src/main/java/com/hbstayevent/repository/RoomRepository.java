package com.hbstayevent.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hbstayevent.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Integer> {

    List<Room> findByHotelId(Integer hotelId);
}