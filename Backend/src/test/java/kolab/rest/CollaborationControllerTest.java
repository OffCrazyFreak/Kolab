package kolab.rest;

import kolab.dto.CollaborationDTO;
import kolab.exception.NotFoundException;
import kolab.domain.Collaboration;
import kolab.domain.Company;
import kolab.domain.Contact;
import kolab.domain.Project;
import kolab.domain.User;
import kolab.domain.enums.CollaborationCategory;
import kolab.domain.enums.CollaborationStatus;
import kolab.service.CollaborationService;
import kolab.service.CompanyService;
import kolab.service.ContactService;
import kolab.service.ProjectService;
import kolab.service.UserService;
// import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CollaborationControllerTest {

    @Mock private CollaborationService collaborationService;
    @Mock private ProjectService projectService;
    @Mock private CompanyService companyService;
    @Mock private ContactService contactService;
    @Mock private UserService userService;

    @InjectMocks private CollaborationController collaborationController;

    private String randomString(String prefix) {
        return prefix + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private CollaborationDTO createValidCollaborationDTO(UUID projectId, UUID companyId, UUID contactId, UUID responsibleId) {
        CollaborationDTO dto = new CollaborationDTO();
        dto.setProjectId(projectId);
        dto.setCompanyId(companyId);
        dto.setContactId(contactId);
        dto.setResponsibleId(responsibleId);
        dto.setCategory(CollaborationCategory.ACADEMIC);
        dto.setStatus(CollaborationStatus.CONTACTED);
        dto.setComment(randomString("comment"));
        dto.setAchievedValue(new Random().nextDouble(1000.0));
        return dto;
    }

    @Test
    void testGetAllCollaborationsReturnsList() {
        List<Collaboration> collaborations = Arrays.asList(new Collaboration(), new Collaboration());

        when(collaborationService.getCollaborations()).thenReturn(collaborations);

        ResponseEntity<List<Collaboration>> response = collaborationController.getCollaborations();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(collaborations, response.getBody());
        verify(collaborationService).getCollaborations();
    }

    @Test
    void testCreateCollaborationWithValidData() {
        UUID projectId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID contactId = UUID.randomUUID();
        UUID responsibleId = UUID.randomUUID();

        CollaborationDTO dto = createValidCollaborationDTO(projectId, companyId, contactId, responsibleId);

        when(projectService.getProjectById(projectId)).thenReturn(new Project());
        when(companyService.getCompanyById(companyId)).thenReturn(new Company());
        when(contactService.getCompanyContactById(contactId)).thenReturn(new Contact());
        when(userService.getUserById(responsibleId)).thenReturn(new User());
        when(collaborationService.createCollaboration(any())).thenReturn(new Collaboration());

        ResponseEntity<?> response = collaborationController.createCollaboration(dto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(collaborationService).createCollaboration(any());
    }

    @Test
    void testDeleteCollaborationById() {
        UUID collabId = UUID.randomUUID();
        doNothing().when(collaborationService).deleteCollaboration(collabId);

        ResponseEntity<Void> response = collaborationController.deleteCollaboration(collabId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
        verify(collaborationService).deleteCollaboration(collabId);
    }

    @Test
    void testGetCollaborationByNonExistentIdReturns404() {
        UUID nonExistentId = UUID.randomUUID();
        when(collaborationService.getCollaborationById(nonExistentId)).thenThrow(new NotFoundException("Not found"));

        ResponseEntity<?> response = collaborationController.getCollaborationById(nonExistentId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Not found", response.getBody());
        verify(collaborationService).getCollaborationById(nonExistentId);
    }

    @Test
    void testCreateCollaborationMissingRequiredFieldsReturns400() {
        // Missing project ID
        CollaborationDTO dto1 = new CollaborationDTO();
        dto1.setCompanyId(UUID.randomUUID());

        ResponseEntity<?> response1 = collaborationController.createCollaboration(dto1);
        assertEquals(HttpStatus.BAD_REQUEST, response1.getStatusCode());
        assertEquals("Project ID is required", response1.getBody());

        // Missing company ID
        CollaborationDTO dto2 = new CollaborationDTO();
        dto2.setProjectId(UUID.randomUUID());
        when(projectService.getProjectById(any())).thenReturn(new Project());

        ResponseEntity<?> response2 = collaborationController.createCollaboration(dto2);
        assertEquals(HttpStatus.BAD_REQUEST, response2.getStatusCode());
        assertEquals("Company ID is required", response2.getBody());
    }

    @Test
    void testCreateOrUpdateCollaborationWithInvalidReferencesReturns400() {
        UUID projectId = UUID.randomUUID();
        UUID companyId = UUID.randomUUID();
        UUID contactId = UUID.randomUUID();
        UUID responsibleId = UUID.randomUUID();

        // Invalid project
        CollaborationDTO dto1 = createValidCollaborationDTO(projectId, companyId, null, null);
        when(projectService.getProjectById(projectId)).thenReturn(null);

        ResponseEntity<?> r1 = collaborationController.createCollaboration(dto1);
        assertEquals(HttpStatus.BAD_REQUEST, r1.getStatusCode());
        assertEquals("Invalid project ID: " + projectId, r1.getBody());

        // Invalid company
        CollaborationDTO dto2 = createValidCollaborationDTO(projectId, companyId, null, null);
        when(projectService.getProjectById(projectId)).thenReturn(new Project());
        when(companyService.getCompanyById(companyId)).thenReturn(null);

        ResponseEntity<?> r2 = collaborationController.createCollaboration(dto2);
        assertEquals(HttpStatus.BAD_REQUEST, r2.getStatusCode());
        assertEquals("Invalid company ID: " + companyId, r2.getBody());

        // Invalid contact
        CollaborationDTO dto3 = createValidCollaborationDTO(projectId, companyId, contactId, null);
        when(companyService.getCompanyById(companyId)).thenReturn(new Company());
        when(contactService.getCompanyContactById(contactId)).thenReturn(null);

        ResponseEntity<?> r3 = collaborationController.createCollaboration(dto3);
        assertEquals(HttpStatus.BAD_REQUEST, r3.getStatusCode());
        assertEquals("Invalid contact ID: " + contactId, r3.getBody());

        // Invalid responsible
        CollaborationDTO dto4 = createValidCollaborationDTO(projectId, companyId, null, responsibleId);
        when(userService.getUserById(responsibleId)).thenReturn(null);

        ResponseEntity<?> r4 = collaborationController.createCollaboration(dto4);
        assertEquals(HttpStatus.BAD_REQUEST, r4.getStatusCode());
        assertEquals("Invalid responsible ID: " + responsibleId, r4.getBody());

        // NotFoundException during update
        UUID collabId = UUID.randomUUID();
        CollaborationDTO updateDto = createValidCollaborationDTO(projectId, companyId, null, null);

        when(collaborationService.updateCollaboration(eq(collabId), any()))
                .thenThrow(new NotFoundException("Not found"));

        ResponseEntity<?> r5 = collaborationController.updateCollaboration(collabId, updateDto);
        assertEquals(HttpStatus.NOT_FOUND, r5.getStatusCode());
        assertEquals("Collaboration or one of the referenced entities not found", r5.getBody());
    }
}
