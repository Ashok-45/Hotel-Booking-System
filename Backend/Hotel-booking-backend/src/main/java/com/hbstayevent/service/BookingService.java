package com.hbstayevent.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hbstayevent.entity.Booking;
import com.hbstayevent.repository.BookingRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;


    public BookingService(
            BookingRepository bookingRepository) {

        this.bookingRepository =
                bookingRepository;
    }


    // ==========================================
    // SAVE BOOKING
    // ==========================================

    public Booking saveBooking(Booking booking) {

        return bookingRepository.save(booking);
    }


    // ==========================================
    // GET ALL BOOKINGS
    // ==========================================

    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }


    // ==========================================
    // GET BOOKING BY BOOKING ID
    // ==========================================

    public Booking getBookingByBookingId(
            String bookingId) {

        return bookingRepository.findByBookingId(
                bookingId
        );
    }


    // ==========================================
    // GET USER BOOKINGS
    // ==========================================

    public List<Booking> getBookingsByAccountEmail(
            String accountEmail) {

        return bookingRepository
                .findByAccountEmail(accountEmail);
    }


    // ==========================================
    // CANCEL HOTEL BOOKING
    // ==========================================

    public Booking cancelBooking(Integer id) {

        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Booking not found"
                                )
                        );


        booking.setStatus("Cancelled");


        return bookingRepository.save(booking);
    }


    // ==========================================
    // DELETE CANCELLED BOOKING
    // ==========================================

    public void deleteBooking(Integer id) {

        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Booking not found"
                                )
                        );


        if (!"Cancelled".equalsIgnoreCase(
                booking.getStatus())) {

            throw new RuntimeException(
                    "Only cancelled bookings can be deleted"
            );
        }


        bookingRepository.deleteById(id);
    }

}