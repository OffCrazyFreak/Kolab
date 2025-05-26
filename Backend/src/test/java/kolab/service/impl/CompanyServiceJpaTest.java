package kolab.service.impl;

import kolab.dao.CompanyRepository;
import kolab.domain.Company;
import kolab.domain.Industry;
import kolab.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CompanyServiceJpaTest {

    @Mock private CompanyRepository companyRepo;

    @InjectMocks private CompanyServiceJpa companyServiceJpa;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private String randomString(String prefix) {
        return prefix + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private Company createValidCompany(String name) {
        Company company = new Company();
        company.setName(name);
        company.setCountry("Country_" + randomString(""));
        company.setCity("City_" + randomString(""));
        company.setZip(new Random().nextLong(10000, 99999));
        company.setIndustry(new Industry());
        return company;
    }

    @Test
    void testGetCompaniesReturnsAllCompanies() {
        List<Company> companies = Arrays.asList(new Company(), new Company());
        when(companyRepo.findAll()).thenReturn(companies);

        List<Company> result = companyServiceJpa.getCompanies();

        assertEquals(companies, result);
        verify(companyRepo).findAll();
    }

    @Test
    void testCreateCompanyWithValidUniqueData() {
        String name = randomString("Company");
        Company company = createValidCompany(name);

        when(companyRepo.existsByName(name)).thenReturn(false);
        when(companyRepo.save(company)).thenReturn(company);

        Company result = companyServiceJpa.createCompany(company);

        assertEquals(company, result);
        verify(companyRepo).existsByName(name);
        verify(companyRepo).save(company);
    }

    @Test
    void testUpdateCompanyWithValidData() {
        UUID id = UUID.randomUUID();
        String oldName = randomString("OldCompany");
        String newName = randomString("NewCompany");

        Company existingCompany = createValidCompany(oldName);
        Company updatedCompany = createValidCompany(newName);

        when(companyRepo.findById(id)).thenReturn(Optional.of(existingCompany));
        when(companyRepo.existsByName(newName)).thenReturn(false);
        when(companyRepo.save(existingCompany)).thenReturn(existingCompany);

        Company result = companyServiceJpa.updateCompany(id, updatedCompany);

        assertEquals(existingCompany, result);
        assertEquals(newName, result.getName());
        verify(companyRepo).findById(id);
        verify(companyRepo).existsByName(newName);
        verify(companyRepo).save(existingCompany);
    }

    @Test
    void testGetCompanyByIdThrowsNotFoundForMissingId() {
        UUID id = UUID.randomUUID();
        when(companyRepo.findById(id)).thenReturn(Optional.empty());

        NotFoundException ex = assertThrows(NotFoundException.class, () -> companyServiceJpa.getCompanyById(id));
        assertTrue(ex.getMessage().contains(id.toString()));
        verify(companyRepo).findById(id);
    }

    @Test
    void testCreateCompanyThrowsOnDuplicateName() {
        String duplicateName = randomString("Duplicate");
        Company company = createValidCompany(duplicateName);

        when(companyRepo.existsByName(duplicateName)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> companyServiceJpa.createCompany(company));
        assertTrue(ex.getMessage().contains("already exists"));
        verify(companyRepo).existsByName(duplicateName);
        verify(companyRepo, never()).save(any());
    }

    @Test
    void testCreateCompanyThrowsOnMissingRequiredFields() {
        Company company = new Company(); // missing name
        company.setCountry("Country");
        company.setCity("City");
        company.setZip(12345L);
        company.setIndustry(new Industry());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> companyServiceJpa.createCompany(company));
        assertTrue(ex.getMessage().contains("Name is required"));
        verify(companyRepo, never()).save(any());
    }
}
