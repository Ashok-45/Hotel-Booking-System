package com.hbstayevent.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hbstayevent.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    Booking findByBookingId(String bookingId);

    List<Booking> findByAccountEmail(String accountEmail);
}