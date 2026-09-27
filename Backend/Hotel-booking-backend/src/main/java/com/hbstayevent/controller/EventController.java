package com.hbstayevent.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hbstayevent.entity.Event;
import com.hbstayevent.service.EventService;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    private final EventService eventService;


    public EventController(EventService eventService) {
        this.eventService = eventService;
    }


    @PostMapping
    public ResponseEntity<Event> addEvent(
            @RequestBody Event event) {

        Event savedEvent =
                eventService.addEvent(event);

        return new ResponseEntity<>(
                savedEvent,
                HttpStatus.CREATED
        );
    }


    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {

        List<Event> events =
                eventService.getAllEvents();

        return new ResponseEntity<>(
                events,
                HttpStatus.OK
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(
            @PathVariable Integer id) {

        Event event =
                eventService.getEventById(id);

        if (event == null) {

            return new ResponseEntity<>(
                    HttpStatus.NOT_FOUND
            );
        }

        return new ResponseEntity<>(
                event,
                HttpStatus.OK
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Integer id,
            @RequestBody Event event) {

        Event updatedEvent =
                eventService.updateEvent(
                        id,
                        event
                );

        if (updatedEvent == null) {

            return new ResponseEntity<>(
                    HttpStatus.NOT_FOUND
            );
        }

        return new ResponseEntity<>(
                updatedEvent,
                HttpStatus.OK
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(
            @PathVariable Integer id) {

        Event existingEvent =
                eventService.getEventById(id);

        if (existingEvent == null) {

            return new ResponseEntity<>(
                    "Event not found",
                    HttpStatus.NOT_FOUND
            );
        }

        eventService.deleteEvent(id);

        return new ResponseEntity<>(
                "Event deleted successfully",
                HttpStatus.OK
        );
    }
}