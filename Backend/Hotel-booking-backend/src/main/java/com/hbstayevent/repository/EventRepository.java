package com.hbstayevent.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hbstayevent.entity.Event;

public interface EventRepository
        extends JpaRepository<Event, Integer> {

}