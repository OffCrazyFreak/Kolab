package kolab.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

import kolab.domain.enums.CompanyCategorization;
import kolab.domain.enums.Month;

@Entity
@Table(name = "company")
@Getter
@Setter
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "industryId", nullable = false)
    private Industry industry;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompanyCategorization categorization;

    @Enumerated(EnumType.STRING)
    @Column(name = "budgetPlanningMonth")
    private Month budgetPlanningMonth;

    @NotBlank(message = "Country is required")
    @Column(nullable = false)
    private String country;

    @NotNull(message = "ZIP code is required")
    @Column(nullable = false)
    private Long zip;

    @NotBlank(message = "City is required")
    @Column(nullable = false)
    private String city;

    @Column
    private String address;

    @Column
    private String webLink;

    @Column
    private String description;

    @Column
    private boolean contactInFuture;
}