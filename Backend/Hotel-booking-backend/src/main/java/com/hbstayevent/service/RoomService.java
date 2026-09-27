package com.hbstayevent.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hbstayevent.entity.Hotel;
import com.hbstayevent.entity.Room;
import com.hbstayevent.repository.HotelRepository;
import com.hbstayevent.repository.RoomRepository;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    public RoomService(RoomRepository roomRepository,
                       HotelRepository hotelRepository) {
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
    }

    // Add room to a hotel
    public Room addRoom(Integer hotelId, Room room) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        room.setHotel(hotel);

        return roomRepository.save(room);
    }

    // Get all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // Get rooms by hotel
    public List<Room> getRoomsByHotel(Integer hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    // Get room by ID
    public Room getRoomById(Integer id) {
        return roomRepository.findById(id).orElse(null);
    }

    // Delete room
    public void deleteRoom(Integer id) {
        roomRepository.deleteById(id);
    }
}