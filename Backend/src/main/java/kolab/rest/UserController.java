package kolab.rest;

import kolab.domain.User;
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
import kolab.domain.enums.UserAuthorization;
import kolab.service.ProjectService;
import kolab.service.CompanyService;
import kolab.domain.Project;
import kolab.domain.Company;
import java.util.List;
import java.util.UUID;

import kolab.service.JwtService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    // Add this autowired service
    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private CollaborationService collaborationService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private CompanyService companyService;

    @GetMapping("")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("")
    // public ResponseEntity<?> createUser(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody User newUser) {
    public ResponseEntity<?> createUser(@Valid @RequestBody User newUser) {
        // String token = authHeader.startsWith("Bearer ") ? 
        //     authHeader.substring(7) : authHeader;
        // String email = jwtService.extractEmail(token);
        // User user = userService.findByEmail(email);

        // Long numOfUsers = userService.countUsers();

        // if (numOfUsers > 0) {
            // if (user.getAuthorization() != UserAuthorization.ADMINISTRATOR) {
            //     return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admin can create users");
            // }

            String newUserEmail = newUser.getEmail();
            if (userService.findByEmail(newUserEmail) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User with email " + newUserEmail + " already exists");
            }
        // }

        try {
            User createdUser = userService.createUser(newUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable UUID id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable UUID id, @Valid @RequestBody User updatedUser) {
        try {
            User user = userService.updateUser(id, updatedUser);
            return ResponseEntity.ok(user);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{userId}/collaborations")
    public ResponseEntity<List<Collaboration>> getCollaborationsByResponsibleId(@PathVariable UUID userId) {
        List<Collaboration> collaborations = collaborationService.getCollaborationsByResponsibleId(userId);
        return ResponseEntity.ok(collaborations);
    }

    @GetMapping("/{userId}/projects")
    public ResponseEntity<List<Project>> getProjectsByResponsibleId(@PathVariable UUID userId) {
        List<Project> projects = projectService.getProjectsByResponsibleId(userId);
        return ResponseEntity.ok(projects);
    }
}

