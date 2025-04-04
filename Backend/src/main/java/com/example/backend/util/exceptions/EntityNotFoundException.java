package com.example.backend.util.exceptions;

public class EntityNotFoundException extends Throwable {
    public EntityNotFoundException() {
    }

    public EntityNotFoundException(String message) {
        super(message);
    }
}
