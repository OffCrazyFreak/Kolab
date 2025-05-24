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
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        String email = user.getEmail();
        if (userService.findByEmail(email) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with email " + email + " already exists");
        }

        try {
            User createdUser = userService.createUser(user);
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

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestHeader("Authorization") String authHeader) {
        try {
            // Remove "Bearer " prefix if present
            String token = authHeader.startsWith("Bearer ") ? 
                authHeader.substring(7) : authHeader;

            // Extract email from Google JWT
            String email = jwtService.extractEmail(token);
            
            // Find user by email
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid token format");
        }
    }

    // TODO: remove when connected to frontend JWT so you can use the enpoint above
    @PostMapping("/login-email")
    public ResponseEntity<?> loginUserByEmail(@RequestHeader("Email") String email) {
        try {
           
            // Find user by email
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid token format");
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

