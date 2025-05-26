package kolab.rest;

import kolab.domain.User;
import kolab.exception.NotFoundException;
import kolab.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock private UserService userService;
    @Mock private JwtService jwtService;
    @Mock private CollaborationService collaborationService;
    @Mock private ProjectService projectService;
    @Mock private CompanyService companyService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // === Utilities ===

    private String randomEmail() {
        return "user_" + UUID.randomUUID().toString().substring(0, 8) + "@example.com";
    }

    private User createUser(String email) {
        User user = new User();
        user.setEmail(email);
        return user;
    }

    // === Tests ===

    @Test
    void testUpdateUserWithValidData() {
        UUID userId = UUID.randomUUID();
        String updatedEmail = randomEmail();

        User updatedUser = createUser(updatedEmail);
        User returnedUser = createUser(updatedEmail);

        when(userService.updateUser(eq(userId), any(User.class))).thenReturn(returnedUser);

        ResponseEntity<?> response = userController.updateUser(userId, updatedUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(returnedUser, response.getBody());
        verify(userService).updateUser(userId, updatedUser);
    }

    @Test
    void testCreateUserWithExistingEmail() {
        String email = randomEmail();
        User user = createUser(email);

        when(userService.findByEmail(email)).thenReturn(new User());

        ResponseEntity<?> response = userController.createUser(user);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("already exists"));
        verify(userService).findByEmail(email);
        verify(userService, never()).createUser(any());
    }

    @Test
    void testCreateUserWithValidData() {
        String email = randomEmail();
        User user = createUser(email);
        User createdUser = createUser(email);

        when(userService.findByEmail(email)).thenReturn(null);
        when(userService.createUser(user)).thenReturn(createdUser);

        ResponseEntity<?> response = userController.createUser(user);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertSame(createdUser, response.getBody());
        verify(userService).findByEmail(email);
        verify(userService).createUser(user);
    }

    @Test
    void testGetUserByIdNotFound() {
        UUID userId = UUID.randomUUID();
        when(userService.getUserById(userId)).thenThrow(new NotFoundException("User not found"));

        ResponseEntity<?> response = userController.getUserById(userId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
        verify(userService).getUserById(userId);
    }

    @Test
    void testUpdateUserNotFound() {
        UUID userId = UUID.randomUUID();
        String email = randomEmail();
        User updatedUser = createUser(email);

        when(userService.updateUser(eq(userId), any(User.class)))
                .thenThrow(new NotFoundException("User not found"));

        ResponseEntity<?> response = userController.updateUser(userId, updatedUser);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
        verify(userService).updateUser(userId, updatedUser);
    }

    @Test
    void testGetUsersReturnsUserList() {
        User user1 = createUser(randomEmail());
        User user2 = createUser(randomEmail());
        List<User> userList = Arrays.asList(user1, user2);

        when(userService.getUsers()).thenReturn(userList);

        ResponseEntity<List<User>> response = userController.getUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userList, response.getBody());
        verify(userService).getUsers();
    }
}
