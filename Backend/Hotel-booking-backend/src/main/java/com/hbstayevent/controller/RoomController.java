package com.hbstayevent.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hbstayevent.entity.Room;
import com.hbstayevent.service.RoomService;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // Add room to hotel
    @PostMapping("/hotel/{hotelId}")
    public Room addRoom(
            @PathVariable Integer hotelId,
            @RequestBody Room room) {

        return roomService.addRoom(hotelId, room);
    }

    // Get all rooms
    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    // Get rooms of a particular hotel
    @GetMapping("/hotel/{hotelId}")
    public List<Room> getRoomsByHotel(
            @PathVariable Integer hotelId) {

        return roomService.getRoomsByHotel(hotelId);
    }

    // Get room by ID
    @GetMapping("/{id}")
    public Room getRoomById(
            @PathVariable Integer id) {

        return roomService.getRoomById(id);
    }

    // Delete room
    @DeleteMapping("/{id}")
    public String deleteRoom(
            @PathVariable Integer id) {

        roomService.deleteRoom(id);

        return "Room deleted successfully";
    }
}