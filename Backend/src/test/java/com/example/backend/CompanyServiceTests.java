package com.example.backend;

import com.example.backend.collaborations.service.CollaborationsService;
import com.example.backend.companies.controller.dto.CompanyDto;
import com.example.backend.companies.model.Company;
import com.example.backend.companies.repo.CompanyRepository;
import com.example.backend.companies.repo.ContactRepository;
import com.example.backend.companies.service.CompanyService;
import com.example.backend.user.model.AUTHORITY;
import com.example.backend.user.model.AppUser;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.naming.AuthenticationException;
import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.shadow.com.univocity.parsers.conversions.Conversions.toLong;

@ExtendWith(MockitoExtension.class)
public class CompanyServiceTests
{
    @Mock
    CompanyRepository companyRepository;

    @Mock
    ContactRepository contactRepository;

    @Mock
    CollaborationsService collaborationsService;

    @InjectMocks
    CompanyService companyService;

    @Test
    public void getAllCompanies_ReturnsCompanies() throws AuthenticationException
    {
        List<Company> companies = List.of(
                new Company(Long.valueOf(1), "name", "sector", 'a', "March", "Croatia", "Zagreb", "Address", "example.com", false, "opis"),
                new Company(Long.valueOf(2), "name", "sector", 'a', "March", "Croatia", "Zagreb", "Address", "example.com", false, "opis"),
                new Company(Long.valueOf(3), "name", "sector", 'a', "March", "Croatia", "Zagreb", "Address", "example.com", false, "opis"));
        Mockito.when(companyRepository.findAll()).thenReturn(companies);

        List<Company> result = companyService.getAllCompanies(mockUser(AUTHORITY.ADMINISTRATOR));
        assertThat(result).isSameAs(companies);
    }

    @Test
    public void getCompany_IfUserIsObserver_ThrowsAuthenticationException() throws AuthenticationException
    {
        Assertions.assertThrows(AuthenticationException.class, () -> {
            companyService.getCompany(mockUser(AUTHORITY.OBSERVER), Long.valueOf(1));
        });
    }

    @Test
    public void getCompany_IfUserIsAdmin_ReturnsCompany() throws AuthenticationException
    {
        Company company = new Company(Long.valueOf(1), "name", "sector", 'a', "March", "Croatia", "Zagreb", "Address", "example.com", false, "opis");
        Mockito.when(companyRepository.findById(Mockito.any())).thenReturn(Optional.of(company));
        Company result = companyService.getCompany(mockUser(AUTHORITY.ADMINISTRATOR), Long.valueOf(1));
        assertThat(result).isSameAs(company);
    }

    @Test
    public void createCompany_CreatesCompany() throws AuthenticationException
    {
        CompanyDto companyDto = new CompanyDto(
                "name",
                "sector",
                'a',
                "February",
                "Croatia",
                "Zagreb",
                "Address",
                "www.example.com",
                false,
                "opis");
        Company company = new Company(
                "name",
                "sector",
                'a',
                "February",
                "Croatia",
                "Zagreb",
                "Address",
                "www.example.com",
                false,
                "opis"
        );

        Mockito.when(companyRepository.save(Mockito.any())).thenReturn(company);
        Company result = companyService.createCompany(mockUser(AUTHORITY.ADMINISTRATOR), companyDto);
        assertThat(result).isSameAs(company);
    }

    @Test
    public void deleteCompany_WhenCompanyDoesntExist_ThrowsEntityNotFoundException(){
        Mockito.when(companyRepository.findById(Mockito.any())).thenReturn(Optional.empty());
        Assertions.assertThrows(EntityNotFoundException.class, () -> {
            companyService.deleteCompany(mockUser(AUTHORITY.ADMINISTRATOR), Long.valueOf(1));
        });
    }

    private AppUser mockUser(AUTHORITY authority){
        return new AppUser(
                "email@email.com",
                authority,
                "first",
                "last",
                "email@email.com",
                "description",
                "nick");
    }
}
