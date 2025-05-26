package kolab.service.impl;

import kolab.dao.UserRepository;
import kolab.domain.User;
import kolab.domain.enums.UserAuthorization;
import kolab.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceJpaTest {

    @Mock
    private UserRepository userRepo;

    @InjectMocks
    private UserServiceJpa userServiceJpa;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Utility method to generate a unique string with a prefix
    private String randomString(String prefix) {
        return prefix + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    // Utility method to generate a unique email
    private String randomEmail() {
        return "user_" + UUID.randomUUID() + "@example.com";
    }

    // Utility to create a valid user with randomized fields
    private User createValidUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setName(randomString("Name"));
        user.setSurname(randomString("Surname"));
        user.setNickname(randomString("Nick"));
        user.setAuthorization(UserAuthorization.USER);
        user.setDescription(randomString("Desc"));
        return user;
    }

    @Test
    void testGetUsersReturnsAllUsers() {
        User user1 = createValidUser(randomEmail());
        User user2 = createValidUser(randomEmail());
        List<User> users = Arrays.asList(user1, user2);

        when(userRepo.findAll()).thenReturn(users);

        List<User> result = userServiceJpa.getUsers();

        assertEquals(users, result);
        verify(userRepo).findAll();
    }

    @Test
    void testCreateUserWithValidData() {
        User user = createValidUser(randomEmail());

        when(userRepo.save(user)).thenReturn(user);

        User result = userServiceJpa.createUser(user);

        assertEquals(user, result);
        verify(userRepo).save(user);
    }

    @Test
    void testUpdateUserWithValidData() {
        UUID userId = UUID.randomUUID();

        User existingUser = createValidUser(randomEmail());

        // Generate updated values
        String newName = randomString("NewName");
        String newSurname = randomString("NewSurname");
        String newNickname = randomString("NewNick");
        String newEmail = randomEmail();
        String newDescription = randomString("NewDesc");

        User updatedUser = new User();
        updatedUser.setName(newName);
        updatedUser.setSurname(newSurname);
        updatedUser.setNickname(newNickname);
        updatedUser.setEmail(newEmail);
        updatedUser.setAuthorization(UserAuthorization.ADMINISTRATOR);
        updatedUser.setDescription(newDescription);

        when(userRepo.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepo.save(existingUser)).thenReturn(existingUser);

        User result = userServiceJpa.updateUser(userId, updatedUser);

        assertEquals(newName, result.getName());
        assertEquals(newSurname, result.getSurname());
        assertEquals(newNickname, result.getNickname());
        assertEquals(newEmail, result.getEmail());
        assertEquals(UserAuthorization.ADMINISTRATOR, result.getAuthorization());
        assertEquals(newDescription, result.getDescription());

        verify(userRepo).findById(userId);
        verify(userRepo).save(existingUser);
    }

    @Test
    void testGetUserByIdThrowsWhenUserNotFound() {
        UUID userId = UUID.randomUUID();
        when(userRepo.findById(userId)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            userServiceJpa.getUserById(userId);
        });

        assertTrue(exception.getMessage().contains(userId.toString()));
        verify(userRepo).findById(userId);
    }

    @Test
    void testCreateUserWithInvalidEmailThrows() {
        User user = createValidUser("invalid-email"); // not a valid email format

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userServiceJpa.createUser(user);
        });

        assertEquals("Invalid email format", exception.getMessage());
        verify(userRepo, never()).save(any());
    }

    @Test
    void testDeleteUserThrowsWhenUserNotFound() {
        UUID userId = UUID.randomUUID();
        when(userRepo.existsById(userId)).thenReturn(false);

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            userServiceJpa.deleteUser(userId);
        });

        assertTrue(exception.getMessage().contains(userId.toString()));
        verify(userRepo, never()).deleteById(any());
    }
}
