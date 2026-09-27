package com.hbstayevent.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hbstayevent.entity.User;
import com.hbstayevent.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        User savedUser = userService.signup(user);

        if (savedUser == null) {
            return new ResponseEntity<>(
                    "Email already registered",
                    HttpStatus.CONFLICT
            );
        }

        savedUser.setPassword(null);

        return new ResponseEntity<>(
                savedUser,
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User loggedInUser =
                userService.login(user.getEmail(), user.getPassword());

        if (loggedInUser == null) {
            return new ResponseEntity<>(
                    "Invalid email or password",
                    HttpStatus.UNAUTHORIZED
            );
        }

        loggedInUser.setPassword(null);

        return new ResponseEntity<>(
                loggedInUser,
                HttpStatus.OK
        );
    }
}