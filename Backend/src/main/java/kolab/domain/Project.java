package kolab.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.UUID;

import kolab.domain.enums.ProjectType;

@Entity
@Table(name = "project")
@Getter
@Setter
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "categoryId", nullable = false)
    private Category category;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectType type;

    @NotNull(message = "Start date is required")
    @Column(name = "startDate", nullable = false)
    private ZonedDateTime startDate;

    @Column(name = "endDate")
    private ZonedDateTime endDate;

    @Column
    private Long goal;

    @ManyToOne
    @JoinColumn(name = "responsibleId", nullable = false)
    private User responsible;
}