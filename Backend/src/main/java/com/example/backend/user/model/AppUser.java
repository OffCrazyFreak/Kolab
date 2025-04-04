package com.example.backend.user.model;

import com.example.backend.project.model.Project;
import com.example.backend.util.SoftLockedInterface;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@SuppressWarnings("ALL")
@Entity
@NoArgsConstructor
@Getter @Setter
public class AppUser implements SoftLockedInterface {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "loginmail", unique = true, nullable = false, length = 60)
    private String loginEmail;

    @Column(nullable = false)
    private AUTHORITY authority;

    @Column(name = "firstname", nullable = false, length = 40)
    private String firstName;

    @Column(name = "lastname", nullable = false, length = 40)
    private String lastName;

    @Column(name = "notificationemail", nullable = false, length = 60)
    private String notificationEmail;

    @Column(length = 480)
    private String description;

    @Column(length = 40, unique = true)
    private String nickname;

    @ManyToMany(mappedBy = "frteammembers")
    @JsonIgnore
    private Set<Project> projects;

    @Column(name = "softLocked")
    @Getter
    @Setter
    private Boolean softLocked = false;

    public AppUser(String loginEmail,
                   AUTHORITY authority,
                   String firstName,
                   String lastName,
                   String notificationEmail,
                   String description,
                   String nickname) {
        this.loginEmail = loginEmail;
        this.authority = authority;
        this.firstName = firstName;
        this.lastName = lastName;
        this.notificationEmail = notificationEmail;
        this.description = description;
        this.nickname = nickname;
        this.projects = new HashSet<>();
        this.softLocked = false;
    }
}
