package com.hbstayevent.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hbstayevent.entity.Event;
import com.hbstayevent.repository.EventRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;


    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }


    public Event addEvent(Event event) {

        return eventRepository.save(event);
    }


    public List<Event> getAllEvents() {

        return eventRepository.findAll();
    }


    public Event getEventById(Integer id) {

        return eventRepository.findById(id)
                .orElse(null);
    }


    public Event updateEvent(
            Integer id,
            Event event) {

        Event existingEvent =
                eventRepository.findById(id)
                        .orElse(null);

        if (existingEvent == null) {
            return null;
        }


        existingEvent.setTitle(
                event.getTitle()
        );

        existingEvent.setCategory(
                event.getCategory()
        );

        existingEvent.setLocation(
                event.getLocation()
        );

        existingEvent.setEventDate(
                event.getEventDate()
        );

        existingEvent.setEventTime(
                event.getEventTime()
        );

        existingEvent.setPrice(
                event.getPrice()
        );

        existingEvent.setImage(
                event.getImage()
        );

        existingEvent.setDescription(
                event.getDescription()
        );


        return eventRepository.save(
                existingEvent
        );
    }


    public void deleteEvent(Integer id) {

        eventRepository.deleteById(id);
    }
}