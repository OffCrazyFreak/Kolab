package kolab.rest;

import kolab.domain.Collaboration;
import kolab.service.CollaborationService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

import kolab.service.ProjectService;
import kolab.service.CompanyService;
import kolab.service.ContactService;
import kolab.service.UserService;
import kolab.dto.CollaborationDTO;
import kolab.domain.Project;
import kolab.domain.Company;
import kolab.domain.Contact;
import kolab.domain.User;

@RestController
@RequestMapping("/api/collaborations")
public class CollaborationController {

    @Autowired
    private CollaborationService collaborationService;
    
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private CompanyService companyService;
    
    @Autowired
    private ContactService contactService;
    
    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<List<Collaboration>> getCollaborations() {
        List<Collaboration> collaborations = collaborationService.getCollaborations();
        return ResponseEntity.ok(collaborations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCollaborationById(@PathVariable UUID id) {
        try {
            Collaboration collaboration = collaborationService.getCollaborationById(id);
            return ResponseEntity.ok(collaboration);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("")
    public ResponseEntity<?> createCollaboration(@Valid @RequestBody CollaborationDTO collaborationDTO) {
        try {
            // Validate required project
            if (collaborationDTO.getProjectId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Project ID is required");
            }
            Project project = projectService.getProjectById(collaborationDTO.getProjectId());
            if (project == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid project ID: " + collaborationDTO.getProjectId());
            }

            // Validate required company
            if (collaborationDTO.getCompanyId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Company ID is required");
            }
            Company company = companyService.getCompanyById(collaborationDTO.getCompanyId());
            if (company == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid company ID: " + collaborationDTO.getCompanyId());
            }

            // Validate contact if provided
            Contact contact = null;
            if (collaborationDTO.getContactId() != null) {
                contact = contactService.getCompanyContactById(collaborationDTO.getContactId());
                if (contact == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid contact ID: " + collaborationDTO.getContactId());
                }
            }

            // Validate responsible if provided
            User responsible = null;
            if (collaborationDTO.getResponsibleId() != null) {
                responsible = userService.getUserById(collaborationDTO.getResponsibleId());
                if (responsible == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid responsible ID: " + collaborationDTO.getResponsibleId());
                }
            }

            Collaboration collaboration = new Collaboration();
            collaboration.setProject(project);
            collaboration.setCompany(company);
            collaboration.setContact(contact);
            collaboration.setResponsible(responsible);
            collaboration.setCategory(collaborationDTO.getCategory());
            collaboration.setStatus(collaborationDTO.getStatus());
            collaboration.setComment(collaborationDTO.getComment());
            collaboration.setAchievedValue(collaborationDTO.getAchievedValue());

            Collaboration createdCollaboration = collaborationService.createCollaboration(collaboration);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCollaboration);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCollaboration(@PathVariable UUID id, @Valid @RequestBody CollaborationDTO collaborationDTO) {
        try {
            Project project = projectService.getProjectById(collaborationDTO.getProjectId());
            Company company = companyService.getCompanyById(collaborationDTO.getCompanyId());
            Contact contact = collaborationDTO.getContactId() != null ? 
                contactService.getCompanyContactById(collaborationDTO.getContactId()) : null;
            User responsible = collaborationDTO.getResponsibleId() != null ? 
                userService.getUserById(collaborationDTO.getResponsibleId()) : null;

            Collaboration collaboration = new Collaboration();
            collaboration.setProject(project);
            collaboration.setCompany(company);
            collaboration.setContact(contact);
            collaboration.setResponsible(responsible);
            collaboration.setCategory(collaborationDTO.getCategory());
            collaboration.setStatus(collaborationDTO.getStatus());
            collaboration.setComment(collaborationDTO.getComment());
            collaboration.setAchievedValue(collaborationDTO.getAchievedValue());

            Collaboration updatedCollaboration = collaborationService.updateCollaboration(id, collaboration);
            return ResponseEntity.ok(updatedCollaboration);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Collaboration or one of the referenced entities not found");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{collaborationId}")
    public ResponseEntity<Void> deleteCollaboration(@PathVariable UUID collaborationId) {
        collaborationService.deleteCollaboration(collaborationId);
        return ResponseEntity.noContent().build();
    }
}