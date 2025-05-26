package kolab.service.impl;

import kolab.dao.ProjectRepository;
import kolab.domain.Category;
import kolab.domain.Project;
import kolab.domain.User;
import kolab.domain.enums.ProjectType;
import kolab.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.ZonedDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProjectServiceJpaTest {

    @Mock
    private ProjectRepository projectRepo;

    @InjectMocks
    private ProjectServiceJpa projectServiceJpa;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // === Utility Methods ===

    private String randomString(String prefix) {
        return prefix + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private Project createValidProject(String name) {
        Project project = new Project();
        project.setName(name);
        project.setType(ProjectType.INTERNAL);
        project.setStartDate(ZonedDateTime.now());
        project.setEndDate(ZonedDateTime.now().plusDays(5));
        project.setGoal(new Random().nextLong(100, 1000));
        project.setCategory(new Category());
        project.setResponsible(new User());
        return project;
    }

    // === Tests ===

    @Test
    void testGetProjectsReturnsAllProjects() {
        List<Project> mockProjects = Arrays.asList(new Project(), new Project());
        when(projectRepo.findAll()).thenReturn(mockProjects);

        List<Project> result = projectServiceJpa.getProjects();

        assertEquals(mockProjects, result);
        verify(projectRepo).findAll();
    }

    @Test
    void testCreateProjectWithValidData() {
        String name = randomString("Project");
        Project project = createValidProject(name);

        when(projectRepo.existsByName(name)).thenReturn(false);
        when(projectRepo.save(project)).thenReturn(project);

        Project result = projectServiceJpa.createProject(project);

        assertEquals(project, result);
        verify(projectRepo).existsByName(name);
        verify(projectRepo).save(project);
    }

    @Test
    void testUpdateProjectWithValidData() {
        UUID id = UUID.randomUUID();

        Project existingProject = new Project();
        existingProject.setName(randomString("OldProject"));

        // Create updated values
        String newName = randomString("UpdatedProject");
        long newGoal = new Random().nextLong(100, 1000);
        ZonedDateTime newStart = ZonedDateTime.now();
        ZonedDateTime newEnd = newStart.plusDays(5);

        Project updatedProject = new Project();
        updatedProject.setName(newName);
        updatedProject.setType(ProjectType.INTERNAL);
        updatedProject.setStartDate(newStart);
        updatedProject.setEndDate(newEnd);
        updatedProject.setGoal(newGoal);
        updatedProject.setCategory(new Category());
        updatedProject.setResponsible(new User());

        when(projectRepo.findById(id)).thenReturn(Optional.of(existingProject));
        when(projectRepo.existsByName(newName)).thenReturn(false);
        when(projectRepo.save(existingProject)).thenReturn(existingProject);

        Project result = projectServiceJpa.updateProject(id, updatedProject);

        assertEquals(existingProject, result);
        assertEquals(newName, result.getName());
        assertEquals(newGoal, result.getGoal());
        verify(projectRepo).findById(id);
        verify(projectRepo).existsByName(newName);
        verify(projectRepo).save(existingProject);
    }

    @Test
    void testGetProjectByIdNotFound() {
        UUID id = UUID.randomUUID();
        when(projectRepo.findById(id)).thenReturn(Optional.empty());

        NotFoundException ex = assertThrows(NotFoundException.class, () -> projectServiceJpa.getProjectById(id));
        assertTrue(ex.getMessage().contains(id.toString()));
        verify(projectRepo).findById(id);
    }

    @Test
    void testCreateProjectWithDuplicateName() {
        String duplicateName = randomString("Duplicate");
        Project project = createValidProject(duplicateName);

        when(projectRepo.existsByName(duplicateName)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> projectServiceJpa.createProject(project));
        assertTrue(ex.getMessage().contains("already exists"));
        verify(projectRepo).existsByName(duplicateName);
        verify(projectRepo, never()).save(any());
    }

    @Test
    void testCreateProjectWithMissingFields() {
        Project project = new Project(); // Missing required fields

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> projectServiceJpa.createProject(project));
        assertTrue(ex.getMessage().contains("Name is required"));
        verify(projectRepo, never()).save(any());
    }
}
