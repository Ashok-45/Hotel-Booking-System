package com.hbstayevent.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hbstayevent.entity.Hotel;
import com.hbstayevent.repository.HotelRepository;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    // Add hotel
    public Hotel addHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    // Get all hotels
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    // Get hotel by ID
    public Hotel getHotelById(Integer id) {
        return hotelRepository.findById(id).orElse(null);
    }

    // Delete hotel
    public void deleteHotel(Integer id) {
        hotelRepository.deleteById(id);
    }
}