package com.hbstayevent.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hbstayevent.entity.EventBooking;
import com.hbstayevent.repository.EventBookingRepository;

@Service
public class EventBookingService {

    private final EventBookingRepository eventBookingRepository;


    public EventBookingService(
            EventBookingRepository eventBookingRepository) {

        this.eventBookingRepository =
                eventBookingRepository;
    }


    // ==========================================
    // SAVE EVENT BOOKING
    // ==========================================

    public EventBooking saveEventBooking(
            EventBooking eventBooking) {

        return eventBookingRepository.save(
                eventBooking
        );
    }


    // ==========================================
    // GET ALL EVENT BOOKINGS
    // ==========================================

    public List<EventBooking> getAllEventBookings() {

        return eventBookingRepository.findAll();
    }


    // ==========================================
    // GET EVENT BOOKING BY BOOKING ID
    // ==========================================

    public EventBooking getEventBookingByBookingId(
            String bookingId) {

        return eventBookingRepository
                .findByBookingId(bookingId);
    }


    // ==========================================
    // GET USER EVENT BOOKINGS
    // ==========================================

    public List<EventBooking>
            getEventBookingsByAccountEmail(
                    String accountEmail) {

        return eventBookingRepository
                .findByAccountEmail(accountEmail);
    }


    // ==========================================
    // CANCEL EVENT BOOKING
    // ==========================================

    public EventBooking cancelEventBooking(
            Integer id) {

        EventBooking booking =
                eventBookingRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Event booking not found"
                                )
                        );


        booking.setStatus("Cancelled");


        return eventBookingRepository.save(
                booking
        );
    }


    // ==========================================
    // DELETE CANCELLED EVENT BOOKING
    // ==========================================

    public void deleteEventBooking(
            Integer id) {

        EventBooking booking =
                eventBookingRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Event booking not found"
                                )
                        );


        if (!"Cancelled".equalsIgnoreCase(
                booking.getStatus())) {

            throw new RuntimeException(
                    "Only cancelled bookings can be deleted"
            );
        }


        eventBookingRepository.deleteById(id);
    }

}