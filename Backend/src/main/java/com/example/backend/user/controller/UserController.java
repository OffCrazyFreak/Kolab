package com.example.backend.user.controller;

import com.example.backend.user.controller.dto.UserDTO;
import com.example.backend.user.model.AppUser;
import com.example.backend.user.service.UserService;
import com.example.backend.util.JwtVerifier;
import com.example.backend.util.exceptions.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.naming.AuthenticationException;

@SuppressWarnings("ALL")
@CrossOrigin
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping()
    @ResponseBody
    public ResponseEntity addUser(@RequestHeader String googleTokenEncoded, @RequestBody UserDTO userDTO) {
        AppUser user = getUser(googleTokenEncoded);
        try {
            return new ResponseEntity<>(userService.addUser(userDTO, user), HttpStatus.CREATED);
        } catch (AuthenticationException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    @PatchMapping("/{userId}/softLock")
    @ResponseBody
    public ResponseEntity<Boolean> softLockUser(@RequestHeader String googleTokenEncoded, @PathVariable Long userId){
        AppUser user = getUser(googleTokenEncoded);
        try
        {
            return new ResponseEntity<>(userService.softLockUser(user, userId), HttpStatus.OK);
        } catch (AuthenticationException e)
        {
            return new ResponseEntity(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (EntityNotFoundException e)
        {
            return new ResponseEntity(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity findUser(@RequestHeader String googleTokenEncoded, @PathVariable Long id){
        AppUser user = getUser(googleTokenEncoded);
        try {
            return new ResponseEntity(userService.findById(id, user), HttpStatus.OK);
        } catch (AuthenticationException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity deleteUser(@RequestHeader String googleTokenEncoded, @PathVariable Long id){
        AppUser user = getUser(googleTokenEncoded);
        try {
            userService.deleteUser(id, user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (AuthenticationException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping()
    @ResponseBody
    public ResponseEntity findAll(@RequestHeader String googleTokenEncoded){
        AppUser user = getUser(googleTokenEncoded);
        try {
            return new ResponseEntity(userService.findAll(user), HttpStatus.OK);
        } catch (AuthenticationException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity updateUser(@RequestHeader String googleTokenEncoded, @RequestBody UserDTO userDTO, @PathVariable Long id){
        AppUser user = getUser(googleTokenEncoded);
        try {
            return new ResponseEntity<>(userService.updateUser(userDTO, id, user), HttpStatus.OK);
        } catch (AuthenticationException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/login")
    @ResponseBody
    public ResponseEntity getByEmail(@RequestHeader String googleTokenEncoded){
        String email = JwtVerifier.verifyAndReturnEmail(googleTokenEncoded);
        if (!userService.existsByEmail(email)) return new ResponseEntity(HttpStatus.NOT_FOUND);

        return new ResponseEntity(userService.findByEmail(email), HttpStatus.OK);
    }

    private AppUser getUser(String googleTokenEncoded){
        String email = JwtVerifier.verifyAndReturnEmail(googleTokenEncoded);
        if (email == null)
            return null;
        return userService.findByEmail(email);
    }
}
