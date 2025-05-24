package kolab.rest;

import kolab.domain.Company;
import kolab.service.CompanyService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import kolab.service.IndustryService;
import kolab.service.ContactService;
import kolab.dto.ContactDTO;
import kolab.domain.Contact;
import kolab.dto.CompanyDTO;
import kolab.domain.Industry;
import kolab.service.CollaborationService;
import kolab.domain.Collaboration;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;
    
    @Autowired
    private IndustryService industryService;

    @Autowired
    private ContactService contactService;
    
    @Autowired
    private CollaborationService collaborationService;

    @GetMapping("")
    public ResponseEntity<List<Company>> getCompanies() {
        List<Company> companies = companyService.getCompanies();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable UUID id) {
        try {
            Company company = companyService.getCompanyById(id);
            return ResponseEntity.ok(company);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("")
    public ResponseEntity<?> createCompany(@Valid @RequestBody CompanyDTO companyDTO) {
        try {
            // Validate required industry
            if (companyDTO.getIndustryId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Industry ID is required");
            }

            Industry industry = industryService.getIndustryById(companyDTO.getIndustryId());
            if (industry == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid industry ID: " + companyDTO.getIndustryId());
            }

            Company company = new Company();
            company.setIndustry(industry);
            company.setName(companyDTO.getName());
            company.setCategorization(companyDTO.getCategorization());
            company.setBudgetPlanningMonth(companyDTO.getBudgetPlanningMonth());
            company.setCountry(companyDTO.getCountry());
            company.setZip(companyDTO.getZip());
            company.setCity(companyDTO.getCity());
            company.setAddress(companyDTO.getAddress());
            company.setWebLink(companyDTO.getWebLink());
            company.setDescription(companyDTO.getDescription());
            company.setContactInFuture(companyDTO.isContactInFuture());

            Company createdCompany = companyService.createCompany(company);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCompany);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable UUID id, @Valid @RequestBody CompanyDTO companyDTO) {
        try {
            Industry industry = industryService.getIndustryById(companyDTO.getIndustryId());

            Company company = new Company();
            company.setIndustry(industry);
            company.setName(companyDTO.getName());
            company.setCategorization(companyDTO.getCategorization());
            company.setBudgetPlanningMonth(companyDTO.getBudgetPlanningMonth());
            company.setCountry(companyDTO.getCountry());
            company.setZip(companyDTO.getZip());
            company.setCity(companyDTO.getCity());
            company.setAddress(companyDTO.getAddress());
            company.setWebLink(companyDTO.getWebLink());
            company.setDescription(companyDTO.getDescription());
            company.setContactInFuture(companyDTO.isContactInFuture());

            Company updatedCompany = companyService.updateCompany(id, company);
            return ResponseEntity.ok(updatedCompany);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Company or Industry not found");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable UUID id) {
        try {
            companyService.deleteCompany(id);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Add these contact endpoints to CompanyController
    @GetMapping("/{companyId}/contacts")
    public ResponseEntity<List<Contact>> getCompanyContacts(@PathVariable UUID companyId) {
        List<Contact> contacts = contactService.getContactsByCompanyId(companyId);
        return ResponseEntity.ok(contacts);
    }

    @PostMapping("/{companyId}/contacts")
    public ResponseEntity<?> createCompanyContact(@PathVariable UUID companyId, 
                                                @Valid @RequestBody ContactDTO contactDTO) {
        try {
            Company company = companyService.getCompanyById(companyId);
            if (company == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid company ID: " + companyId);
            }

            Contact contact = new Contact();
            contact.setCompany(company);
            contact.setFirstName(contactDTO.getFirstName());
            contact.setLastName(contactDTO.getLastName());
            contact.setPosition(contactDTO.getPosition());
            contact.setEmail(contactDTO.getEmail());
            contact.setPhone(contactDTO.getPhone());

            Contact createdContact = contactService.createCompanyContact(contact);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdContact);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{companyId}/contacts/{contactId}")
    public ResponseEntity<?> updateCompanyContact(@PathVariable UUID companyId,
                                                @PathVariable UUID contactId,
                                                @Valid @RequestBody ContactDTO contactDTO) {
        try {
            Company company = companyService.getCompanyById(companyId);
            if (company == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid company ID: " + companyId);
            }

            Contact contact = new Contact();
            contact.setCompany(company);
            contact.setFirstName(contactDTO.getFirstName());
            contact.setLastName(contactDTO.getLastName());
            contact.setPosition(contactDTO.getPosition());
            contact.setEmail(contactDTO.getEmail());
            contact.setPhone(contactDTO.getPhone());

            Contact updatedContact = contactService.updateCompanyContact(contactId, contact);
            return ResponseEntity.ok(updatedContact);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Contact not found");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{companyId}/contacts/{contactId}")
    public ResponseEntity<?> deleteCompanyContact(@PathVariable UUID companyId,
                                                @PathVariable UUID contactId) {
        try {
            contactService.deleteCompanyContact(contactId);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{companyId}/collaborations")
    public ResponseEntity<List<Collaboration>> getCollaborationsByCompanyId(@PathVariable UUID companyId) {
        List<Collaboration> collaborations = collaborationService.getCollaborationsByCompanyId(companyId);
        return ResponseEntity.ok(collaborations);
    }
}