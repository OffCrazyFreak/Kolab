package kolab.rest;

import kolab.domain.Project;
import kolab.domain.Category;
import kolab.domain.User;
import kolab.dto.ProjectDTO;
import kolab.service.ProjectService;
import kolab.service.CategoryService;
import kolab.service.UserService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import kolab.service.CollaborationService;
import kolab.domain.Collaboration;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private UserService userService;

    @Autowired
    private CollaborationService collaborationService;

    @GetMapping("")
    public ResponseEntity<List<Project>> getProjects() {
        List<Project> projects = projectService.getProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable UUID id) {
        try {
            Project project = projectService.getProjectById(id);
            return ResponseEntity.ok(project);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("")
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectDTO projectDTO) {
        try {
            // Validate required category
            if (projectDTO.getCategoryId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Category ID is required");
            }
            Category category = categoryService.getCategoryById(projectDTO.getCategoryId());
            if (category == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid category ID: " + projectDTO.getCategoryId());
            }

            // Validate required responsible user
            if (projectDTO.getResponsibleId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Responsible user ID is required");
            }
            User responsible = userService.getUserById(projectDTO.getResponsibleId());
            if (responsible == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid responsible user ID: " + projectDTO.getResponsibleId());
            }

            Project project = new Project();
            project.setCategory(category);
            project.setResponsible(responsible);
            project.setName(projectDTO.getName());
            project.setType(projectDTO.getType());
            project.setStartDate(projectDTO.getStartDate());
            project.setEndDate(projectDTO.getEndDate());
            project.setGoal(projectDTO.getGoal());

            Project createdProject = projectService.createProject(project);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable UUID id, @Valid @RequestBody ProjectDTO projectDTO) {
        try {
            // Validate required category
            if (projectDTO.getCategoryId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Category ID is required");
            }
            Category category = categoryService.getCategoryById(projectDTO.getCategoryId());
            if (category == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid category ID: " + projectDTO.getCategoryId());
            }

            // Validate required responsible user
            if (projectDTO.getResponsibleId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Responsible user ID is required");
            }
            User responsible = userService.getUserById(projectDTO.getResponsibleId());
            if (responsible == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid responsible user ID: " + projectDTO.getResponsibleId());
            }

            Project project = new Project();
            project.setCategory(category);
            project.setResponsible(responsible);
            project.setName(projectDTO.getName());
            project.setType(projectDTO.getType());
            project.setStartDate(projectDTO.getStartDate());
            project.setEndDate(projectDTO.getEndDate());
            project.setGoal(projectDTO.getGoal());

            Project updatedProject = projectService.updateProject(id, project);
            return ResponseEntity.ok(updatedProject);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{projectId}/collaborations")
    public ResponseEntity<List<Collaboration>> getCollaborationsByProjectId(@PathVariable UUID projectId) {
        List<Collaboration> collaborations = collaborationService.getCollaborationsByProjectId(projectId);
        return ResponseEntity.ok(collaborations);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }
}