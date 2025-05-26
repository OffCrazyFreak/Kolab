package kolab.rest;

import kolab.dto.ProjectDTO;
import kolab.exception.NotFoundException;
import kolab.domain.Category;
import kolab.domain.Project;
import kolab.domain.User;
import kolab.domain.enums.ProjectType;
import kolab.service.CategoryService;
import kolab.service.CollaborationService;
import kolab.service.ProjectService;
import kolab.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// import java.time.LocalDate;
// import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ProjectControllerTest {

    @InjectMocks
    private ProjectController projectController;

    @Mock
    private ProjectService projectService;

    @Mock
    private CategoryService categoryService;

    @Mock
    private UserService userService;

    @Mock
    private CollaborationService collaborationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // === Utility Methods ===

    private String randomString(String prefix) {
        return prefix + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private ProjectDTO createValidProjectDTO(UUID categoryId, UUID responsibleId) {
        ProjectDTO dto = new ProjectDTO();
        dto.setCategoryId(categoryId);
        dto.setResponsibleId(responsibleId);
        dto.setName(randomString("Project"));
        dto.setType(ProjectType.INTERNAL);
        dto.setStartDate(ZonedDateTime.now());
        dto.setEndDate(ZonedDateTime.now().plusDays(10));
        dto.setGoal(new Random().nextLong(100, 1000));
        return dto;
    }

    // === Tests ===

    @Test
    void testGetAllProjectsReturnsList() {
        List<Project> mockProjects = Arrays.asList(new Project(), new Project());
        when(projectService.getProjects()).thenReturn(mockProjects);

        ResponseEntity<List<Project>> response = projectController.getProjects();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockProjects, response.getBody());
        verify(projectService).getProjects();
    }

    @Test
    void testCreateProjectWithValidData() {
        UUID categoryId = UUID.randomUUID();
        UUID responsibleId = UUID.randomUUID();
        ProjectDTO dto = createValidProjectDTO(categoryId, responsibleId);

        Category mockCategory = new Category();
        User mockUser = new User();
        Project mockProject = new Project();

        when(categoryService.getCategoryById(categoryId)).thenReturn(mockCategory);
        when(userService.getUserById(responsibleId)).thenReturn(mockUser);
        when(projectService.createProject(any(Project.class))).thenReturn(mockProject);

        ResponseEntity<?> response = projectController.createProject(dto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(mockProject, response.getBody());
        verify(categoryService).getCategoryById(categoryId);
        verify(userService).getUserById(responsibleId);
        verify(projectService).createProject(any(Project.class));
    }

    @Test
    void testUpdateProjectWithValidData() {
        UUID projectId = UUID.randomUUID();
        UUID categoryId = UUID.randomUUID();
        UUID responsibleId = UUID.randomUUID();
        ProjectDTO dto = createValidProjectDTO(categoryId, responsibleId);
        dto.setType(ProjectType.EXTERNAL);
        dto.setGoal(new Random().nextLong(200, 1000));

        Category mockCategory = new Category();
        User mockUser = new User();
        Project updatedProject = new Project();

        when(categoryService.getCategoryById(categoryId)).thenReturn(mockCategory);
        when(userService.getUserById(responsibleId)).thenReturn(mockUser);
        when(projectService.updateProject(eq(projectId), any(Project.class))).thenReturn(updatedProject);

        ResponseEntity<?> response = projectController.updateProject(projectId, dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedProject, response.getBody());
        verify(categoryService).getCategoryById(categoryId);
        verify(userService).getUserById(responsibleId);
        verify(projectService).updateProject(eq(projectId), any(Project.class));
    }

    @Test
    void testGetProjectByNonExistentIdReturns404() {
        UUID projectId = UUID.randomUUID();
        when(projectService.getProjectById(projectId)).thenThrow(new NotFoundException("Project not found"));

        ResponseEntity<?> response = projectController.getProjectById(projectId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Project not found", response.getBody());
        verify(projectService).getProjectById(projectId);
    }

    @Test
    void testCreateProjectMissingCategoryIdReturns400() {
        ProjectDTO dto = new ProjectDTO();
        dto.setCategoryId(null);
        dto.setResponsibleId(UUID.randomUUID());
        dto.setName(randomString("NoCategoryProject"));

        ResponseEntity<?> response = projectController.createProject(dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Category ID is required", response.getBody());
        verify(categoryService, never()).getCategoryById(any());
        verify(userService, never()).getUserById(any());
        verify(projectService, never()).createProject(any());
    }

    @Test
    void testUpdateProjectWithInvalidResponsibleIdReturns400() {
        UUID projectId = UUID.randomUUID();
        UUID categoryId = UUID.randomUUID();
        UUID invalidResponsibleId = UUID.randomUUID();

        ProjectDTO dto = createValidProjectDTO(categoryId, invalidResponsibleId);
        dto.setName(randomString("InvalidResponsible"));

        Category mockCategory = new Category();
        when(categoryService.getCategoryById(categoryId)).thenReturn(mockCategory);
        when(userService.getUserById(invalidResponsibleId)).thenReturn(null);

        ResponseEntity<?> response = projectController.updateProject(projectId, dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid responsible user ID: " + invalidResponsibleId, response.getBody());
        verify(categoryService).getCategoryById(categoryId);
        verify(userService).getUserById(invalidResponsibleId);
        verify(projectService, never()).updateProject(any(), any());
    }
}
