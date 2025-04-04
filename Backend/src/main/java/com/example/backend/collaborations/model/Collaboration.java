package com.example.backend.collaborations.model;

import com.example.backend.collaborations.model.enums.Category;
import com.example.backend.collaborations.model.enums.Status;
import com.example.backend.companies.model.Contact;
import com.example.backend.user.model.AppUser;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Getter @Setter
@AllArgsConstructor
public class Collaboration {
    @EmbeddedId
    private CollaborationId collaborationId;

    @OneToOne
    private Contact contact;

    @OneToOne
    private AppUser contactResponsible;

    @Column(nullable = false)
    private boolean priority;

    private Category categories;

    private Status status;

    private String comment;

    @Column(name = "achievedValue")
    private Long achievedValue;
}
