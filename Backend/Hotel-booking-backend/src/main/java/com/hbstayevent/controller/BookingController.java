package com.hbstayevent.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hbstayevent.entity.Booking;
import com.hbstayevent.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;


    public BookingController(
            BookingService bookingService) {

        this.bookingService =
                bookingService;
    }


    // ==========================================
    // ADD BOOKING
    // ==========================================

    @PostMapping
    public ResponseEntity<Booking> addBooking(
            @RequestBody Booking booking) {

        Booking savedBooking =
                bookingService.saveBooking(booking);

        return new ResponseEntity<>(
                savedBooking,
                HttpStatus.CREATED
        );
    }


    // ==========================================
    // GET ALL BOOKINGS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Booking>>
            getAllBookings() {

        List<Booking> bookings =
                bookingService.getAllBookings();

        return new ResponseEntity<>(
                bookings,
                HttpStatus.OK
        );
    }


    // ==========================================
    // GET USER BOOKINGS
    // ==========================================

    @GetMapping("/user/{accountEmail}")
    public ResponseEntity<List<Booking>>
            getUserBookings(
                    @PathVariable String accountEmail) {

        List<Booking> bookings =
                bookingService
                        .getBookingsByAccountEmail(
                                accountEmail
                        );

        return new ResponseEntity<>(
                bookings,
                HttpStatus.OK
        );
    }


    // ==========================================
    // GET BOOKING BY BOOKING ID
    // ==========================================

    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking>
            getBookingByBookingId(
                    @PathVariable String bookingId) {

        Booking booking =
                bookingService
                        .getBookingByBookingId(
                                bookingId
                        );


        if (booking == null) {

            return new ResponseEntity<>(
                    HttpStatus.NOT_FOUND
            );
        }


        return new ResponseEntity<>(
                booking,
                HttpStatus.OK
        );
    }


    // ==========================================
    // CANCEL HOTEL BOOKING
    // ==========================================

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking>
            cancelBooking(
                    @PathVariable Integer id) {

        Booking cancelledBooking =
                bookingService.cancelBooking(id);

        return new ResponseEntity<>(
                cancelledBooking,
                HttpStatus.OK
        );
    }


    // ==========================================
    // DELETE CANCELLED BOOKING
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
            deleteBooking(
                    @PathVariable Integer id) {

        bookingService.deleteBooking(id);

        return new ResponseEntity<>(
                "Cancelled booking deleted successfully",
                HttpStatus.OK
        );
    }

}