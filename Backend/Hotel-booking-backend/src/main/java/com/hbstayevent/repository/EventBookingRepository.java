package com.hbstayevent.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hbstayevent.entity.EventBooking;

@Repository
public interface EventBookingRepository
        extends JpaRepository<EventBooking, Integer> {

    List<EventBooking> findByAccountEmail(String accountEmail);

    EventBooking findByBookingId(String bookingId);
}