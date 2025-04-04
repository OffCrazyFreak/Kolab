package com.example.backend.companies.controller.dto;

import com.example.backend.companies.model.Company;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CompanyDto
{
    private String name;

    private String sector;

    private Character abcCategory;

    private String budgetPlanningMonth;

    private String country;

    private String townName;

    private String address;

    private String webUrl;

    private boolean contactInFuture;

    private String description;

    public CompanyDto(String name, String sector, Character abcCategory, String budgetPlanningMonth, String country, String townName, String address, String webUrl, boolean contactInFuture, String description) {
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
    }

    public Company toCompany(){
        return new Company(
                name,
                sector,
                abcCategory,
                budgetPlanningMonth,
                country,
                townName,
                address,
                webUrl,
                contactInFuture,
                description
        );
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getSector()
    {
        return sector;
    }

    public void setSector(String sector)
    {
        this.sector = sector;
    }

    public Character getAbcCategory()
    {
        return abcCategory;
    }

    public void setAbcCategory(Character abcCategory)
    {
        this.abcCategory = abcCategory;
    }

    public String getBudgetPlanningMonth()
    {
        return budgetPlanningMonth;
    }

    public void setBudgetPlanningMonth(String budgetPlanningMonth)
    {
        this.budgetPlanningMonth = budgetPlanningMonth;
    }

    public String getCountry()
    {
        return country;
    }

    public void setCountry(String country)
    {
        this.country = country;
    }

    public String getTownName()
    {
        return townName;
    }

    public void setTownName(String townName)
    {
        this.townName = townName;
    }

    public String getAddress()
    {
        return address;
    }

    public void setAddress(String address)
    {
        this.address = address;
    }

    public String getWebUrl()
    {
        return webUrl;
    }

    public void setWebUrl(String webUrl)
    {
        this.webUrl = webUrl;
    }

    public boolean isContactInFuture()
    {
        return contactInFuture;
    }

    public void setContactInFuture(boolean contactInFuture)
    {
        this.contactInFuture = contactInFuture;
    }
}
