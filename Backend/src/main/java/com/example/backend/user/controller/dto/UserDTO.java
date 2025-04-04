package com.example.backend.user.controller.dto;

import com.example.backend.user.model.AUTHORITY;
import com.example.backend.user.model.AppUser;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter @Setter
public class UserDTO {
    private String loginEmail;
    private AUTHORITY authority;
    private String firstName;
    private String lastName;
    private String notificationEmail;
    private String description;
    private String nickname;

    public AppUser toAppUser(){
        return new AppUser(
                loginEmail,
                authority,
                firstName,
                lastName,
                notificationEmail,
                description,
                nickname
        );
    }
}
