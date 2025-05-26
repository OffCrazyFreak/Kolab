package kolab.service.impl;

import kolab.dao.CollaborationRepository;
import kolab.domain.Collaboration;
import kolab.domain.Company;
import kolab.domain.Contact;
import kolab.domain.Project;
import kolab.domain.User;
import kolab.domain.enums.CollaborationCategory;
import kolab.domain.enums.CollaborationStatus;
import kolab.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CollaborationServiceJpaTest {

    @Mock
    private CollaborationRepository collaborationRepo;

    @InjectMocks
    private CollaborationServiceJpa collaborationServiceJpa;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private Collaboration createValidCollaboration() {
        Collaboration collab = new Collaboration();
        collab.setProject(new Project());
        collab.setCompany(new Company());
        collab.setContact(new Contact());
        collab.setResponsible(new User());
        collab.setCategory(CollaborationCategory.FINANCIAL);
        collab.setStatus(CollaborationStatus.SUCCESSFUL);
        collab.setComment("Some comment");
        collab.setAchievedValue(99.9);
        return collab;
    }

    @Test
    void testGetCollaborationsReturnsAll() {
        List<Collaboration> collaborations = Arrays.asList(new Collaboration(), new Collaboration());
        when(collaborationRepo.findAll()).thenReturn(collaborations);

        List<Collaboration> result = collaborationServiceJpa.getCollaborations();

        assertEquals(collaborations, result);
        verify(collaborationRepo).findAll();
    }

    @Test
    void testCreateCollaborationWithValidData() {
        Collaboration collaboration = createValidCollaboration();

        when(collaborationRepo.save(collaboration)).thenReturn(collaboration);

        Collaboration result = collaborationServiceJpa.createCollaboration(collaboration);

        assertEquals(collaboration, result);
        verify(collaborationRepo).save(collaboration);
    }

    @Test
    void testUpdateCollaborationWithValidData() {
        UUID id = UUID.randomUUID();
        Collaboration existing = new Collaboration();
        Collaboration updated = createValidCollaboration();
        updated.setComment("Updated comment");
        updated.setAchievedValue(42.0);

        when(collaborationRepo.findById(id)).thenReturn(Optional.of(existing));
        when(collaborationRepo.save(existing)).thenReturn(existing);

        Collaboration result = collaborationServiceJpa.updateCollaboration(id, updated);

        assertEquals(existing, result);
        assertEquals("Updated comment", existing.getComment());
        assertEquals(42.0, existing.getAchievedValue());
        verify(collaborationRepo).findById(id);
        verify(collaborationRepo).save(existing);
    }

    @Test
    void testGetCollaborationByIdNotFound() {
        UUID id = UUID.randomUUID();
        when(collaborationRepo.findById(id)).thenReturn(Optional.empty());

        NotFoundException ex = assertThrows(NotFoundException.class, () -> collaborationServiceJpa.getCollaborationById(id));

        assertTrue(ex.getMessage().contains(id.toString()));
    }

    @Test
    void testCreateCollaborationMissingRequiredFields() {
        Collaboration collab = new Collaboration(); // All fields null

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> collaborationServiceJpa.createCollaboration(collab));

        assertTrue(
            ex.getMessage().contains("Project is required")
            || ex.getMessage().contains("Company is required")
            || ex.getMessage().contains("Category is required")
            || ex.getMessage().contains("Status is required")
        );

        verify(collaborationRepo, never()).save(any());
    }

    @Test
    void testDeleteCollaborationNotFound() {
        UUID id = UUID.randomUUID();
        when(collaborationRepo.existsById(id)).thenReturn(false);

        NotFoundException ex = assertThrows(NotFoundException.class, () -> collaborationServiceJpa.deleteCollaboration(id));

        assertTrue(ex.getMessage().contains(id.toString()));
        verify(collaborationRepo, never()).deleteById(any());
    }
}
