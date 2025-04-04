package com.example.backend.companies.model;

import com.example.backend.companies.controller.dto.CompanyDto;
import com.example.backend.util.SoftLockedInterface;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@NoArgsConstructor
@Getter @Setter
public class Company implements SoftLockedInterface
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "name", length = 60, nullable = false)
    private String name;

    @Column(name = "sector", length = 40, nullable = false)
    private String sector;

    @Column(name = "abcCategory")
    private Character abcCategory;

    @Column(name = "budgetPlanningMonth")
    private String budgetPlanningMonth;

    @Column(length = 60, name = "country", nullable = false)
    private String country;

    @Column(name = "townName", nullable = false, length = 120)
    private String townName;

    @Column(name = "address", nullable = false, length = 120)
    private String address;

    @Column(name = "webUrl", length = 60)
    private String webUrl;

    @Column(name = "contactInFuture", nullable = false)
    private boolean contactInFuture;

    @Column(name = "description", length = 480)
    private String description;

    @Column(name = "softLocked")
    @Getter
    @Setter
    private Boolean softLocked = false;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "company")
    private Set<Contact> contacts;

    public Company(Long id, String name, String sector, Character abcCategory, String budgetPlanningMonth, String country, String townName, String address, String webUrl, boolean contactInFuture, String description) {
        this.id = id;
        this.name = name;
        this.sector = sector;
        this.abcCategory = abcCategory;
        this.budgetPlanningMonth = budgetPlanningMonth;
        this.country = country;
        this.townName = townName;
        this.address = address;
        this.webUrl = webUrl;
        this.contactInFuture = contactInFuture;
        this.description = description;
        this.softLocked = false;
    }

    public Company(String name, String sector, Character abcCategory, String budgetPlanningMonth, String country, String townName, String address, String webUrl, boolean contactInFuture, String description) {
        this.name = name;
        this.sector = sector;
        this.abcCategory = abcCategory;
        this.budgetPlanningMonth = budgetPlanningMonth;
        this.country = country;
        this.townName = townName;
        this.address = address;
        this.webUrl = webUrl;
        this.contactInFuture = contactInFuture;
        this.description = description;
        this.softLocked = false;
    }

    public boolean shouldContactInFuture()
    {
        return contactInFuture;
    }

    public void updateWith(CompanyDto companyDto){
        name = companyDto.getName();
        address = companyDto.getAddress();
        sector = companyDto.getSector();
        country = companyDto.getCountry();
        abcCategory = companyDto.getAbcCategory();
        budgetPlanningMonth = companyDto.getBudgetPlanningMonth();
        townName = companyDto.getTownName();
        webUrl = companyDto.getWebUrl();
        contactInFuture = companyDto.isContactInFuture();
        description = companyDto.getDescription();
    }
}
