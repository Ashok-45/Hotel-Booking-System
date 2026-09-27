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

import com.hbstayevent.entity.EventBooking;
import com.hbstayevent.service.EventBookingService;

@RestController
@RequestMapping("/api/event-bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class EventBookingController {

    private final EventBookingService eventBookingService;


    public EventBookingController(
            EventBookingService eventBookingService) {

        this.eventBookingService =
                eventBookingService;
    }


    // ==========================================
    // ADD EVENT BOOKING
    // ==========================================

    @PostMapping
    public ResponseEntity<EventBooking>
            addEventBooking(
                    @RequestBody EventBooking eventBooking) {

        EventBooking savedBooking =
                eventBookingService.saveEventBooking(
                        eventBooking
                );

        return new ResponseEntity<>(
                savedBooking,
                HttpStatus.CREATED
        );
    }


    // ==========================================
    // GET ALL EVENT BOOKINGS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<EventBooking>>
            getAllEventBookings() {

        List<EventBooking> bookings =
                eventBookingService
                        .getAllEventBookings();

        return new ResponseEntity<>(
                bookings,
                HttpStatus.OK
        );
    }


    // ==========================================
    // GET USER EVENT BOOKINGS
    // ==========================================

    @GetMapping("/user/{accountEmail}")
    public ResponseEntity<List<EventBooking>>
            getEventBookingsByUser(
                    @PathVariable String accountEmail) {

        List<EventBooking> bookings =
                eventBookingService
                        .getEventBookingsByAccountEmail(
                                accountEmail
                        );

        return new ResponseEntity<>(
                bookings,
                HttpStatus.OK
        );
    }


    // ==========================================
    // GET EVENT BOOKING BY BOOKING ID
    // ==========================================

    @GetMapping("/{bookingId}")
    public ResponseEntity<EventBooking>
            getEventBookingByBookingId(
                    @PathVariable String bookingId) {

        EventBooking booking =
                eventBookingService
                        .getEventBookingByBookingId(
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
    // CANCEL EVENT BOOKING
    // ==========================================

    @PutMapping("/{id}/cancel")
    public ResponseEntity<EventBooking>
            cancelEventBooking(
                    @PathVariable Integer id) {

        EventBooking cancelledBooking =
                eventBookingService
                        .cancelEventBooking(id);

        return new ResponseEntity<>(
                cancelledBooking,
                HttpStatus.OK
        );
    }


    // ==========================================
    // DELETE CANCELLED EVENT BOOKING
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
            deleteEventBooking(
                    @PathVariable Integer id) {

        eventBookingService
                .deleteEventBooking(id);

        return new ResponseEntity<>(
                "Cancelled event booking deleted successfully",
                HttpStatus.OK
        );
    }

}