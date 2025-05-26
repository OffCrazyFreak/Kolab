package kolab.rest;

import kolab.dto.CompanyDTO;
import kolab.dto.ContactDTO;
import kolab.domain.*;
import kolab.domain.enums.CompanyCategorization;
import kolab.domain.enums.Month;
import kolab.exception.NotFoundException;
import kolab.service.CollaborationService;
import kolab.service.CompanyService;
import kolab.service.ContactService;
import kolab.service.IndustryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompanyControllerTest {

    @Mock private CompanyService companyService;
    @Mock private IndustryService industryService;
    @Mock private ContactService contactService;
    @Mock private CollaborationService collaborationService;

    @InjectMocks private CompanyController companyController;

    // === Utilities ===

    private String randomString(String prefix) {
        return prefix + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private CompanyDTO createValidCompanyDTO(UUID industryId) {
        CompanyDTO dto = new CompanyDTO();
        dto.setIndustryId(industryId);
        dto.setName(randomString("Company"));
        dto.setCategorization(CompanyCategorization.A);
        dto.setBudgetPlanningMonth(Month.JANUARY);
        dto.setCountry("Country");
        dto.setZip(new Random().nextLong(10000, 99999));
        dto.setCity("City_" + randomString(""));
        dto.setAddress("Street " + new Random().nextInt(100));
        dto.setWebLink("https://company-" + randomString("web") + ".com");
        dto.setDescription("A test company description");
        dto.setContactInFuture(false);
        return dto;
    }

    @Test
    void testGetCompaniesReturnsAllCompanies() {
        List<Company> companies = Arrays.asList(new Company(), new Company());
        when(companyService.getCompanies()).thenReturn(companies);

        ResponseEntity<List<Company>> response = companyController.getCompanies();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(companies, response.getBody());
        verify(companyService).getCompanies();
    }

    @Test
    void testCreateCompanyWithValidData() {
        UUID industryId = UUID.randomUUID();
        Industry industry = new Industry();
        CompanyDTO companyDTO = createValidCompanyDTO(industryId);
        Company createdCompany = new Company();

        when(industryService.getIndustryById(industryId)).thenReturn(industry);
        when(companyService.createCompany(any(Company.class))).thenReturn(createdCompany);

        ResponseEntity<?> response = companyController.createCompany(companyDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(createdCompany, response.getBody());
        verify(companyService).createCompany(any(Company.class));
    }

    @Test
    void testUpdateCompanyWithValidInput() {
        UUID companyId = UUID.randomUUID();
        UUID industryId = UUID.randomUUID();
        Industry industry = new Industry();
        CompanyDTO companyDTO = createValidCompanyDTO(industryId);

        companyDTO.setCategorization(CompanyCategorization.B);
        companyDTO.setBudgetPlanningMonth(Month.FEBRUARY);
        companyDTO.setCity("UpdatedCity_" + randomString(""));
        companyDTO.setContactInFuture(true);

        Company updatedCompany = new Company();

        when(industryService.getIndustryById(industryId)).thenReturn(industry);
        when(companyService.updateCompany(eq(companyId), any(Company.class))).thenReturn(updatedCompany);

        ResponseEntity<?> response = companyController.updateCompany(companyId, companyDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedCompany, response.getBody());
        verify(companyService).updateCompany(eq(companyId), any(Company.class));
    }

    @Test
    void testGetCompanyByNonExistentIdReturnsNotFound() {
        UUID companyId = UUID.randomUUID();
        when(companyService.getCompanyById(companyId)).thenThrow(new NotFoundException("Company not found"));

        ResponseEntity<?> response = companyController.getCompanyById(companyId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Company not found", response.getBody());
        verify(companyService).getCompanyById(companyId);
    }

    @Test
    void testCreateCompanyWithoutIndustryIdReturnsBadRequest() {
        CompanyDTO dto = createValidCompanyDTO(null); // industryId intentionally null

        ResponseEntity<?> response = companyController.createCompany(dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Industry ID is required", response.getBody());
        verify(companyService, never()).createCompany(any(Company.class));
    }

    @Test
    void testCreateContactForInvalidCompanyReturnsBadRequest() {
        UUID invalidCompanyId = UUID.randomUUID();
        ContactDTO contactDTO = new ContactDTO();

        when(companyService.getCompanyById(invalidCompanyId)).thenReturn(null);

        ResponseEntity<?> response = companyController.createCompanyContact(invalidCompanyId, contactDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid company ID: " + invalidCompanyId, response.getBody());
        verify(contactService, never()).createCompanyContact(any(Contact.class));
    }
}
