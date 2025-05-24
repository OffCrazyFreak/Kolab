package kolab.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

import kolab.domain.enums.CollaborationCategory;
import kolab.domain.enums.CollaborationStatus;

@Entity
@Table(name = "collaboration")
@Getter
@Setter
public class Collaboration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "projectId", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "companyId", nullable = false)
    private Company company;

    @ManyToOne
    @JoinColumn(name = "contactId")
    private Contact contact;

    @ManyToOne
    @JoinColumn(name = "responsibleId")
    private User responsible;

    @NotBlank(message = "Category is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CollaborationCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CollaborationStatus status;

    @Column
    private String comment;

    @Column
    private Double achievedValue;
}