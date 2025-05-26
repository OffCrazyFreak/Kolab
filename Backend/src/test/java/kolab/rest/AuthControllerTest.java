package kolab.rest;

import kolab.domain.User;
import kolab.service.UserService;
import kolab.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock private UserService userService;
    @Mock private JwtService jwtService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private String randomEmail() {
        return "user_" + java.util.UUID.randomUUID().toString().substring(0, 8) + "@example.com";
    }

    private User createUser(String email) {
        User user = new User();
        user.setEmail(email);
        return user;
    }

    @Test
    void testLoginUserWithValidJwtToken() {
        String token = "valid.jwt.token";
        String bearerToken = "Bearer " + token;
        String email = randomEmail();
        User mockUser = createUser(email);

        when(jwtService.extractEmail(token)).thenReturn(email);
        when(userService.findByEmail(email)).thenReturn(mockUser);

        ResponseEntity<?> response = authController.loginUser(bearerToken);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(mockUser, response.getBody());
        verify(jwtService).extractEmail(token);
        verify(userService).findByEmail(email);
    }

    @Test
    void testLoginUserWithInvalidJwtToken() {
        String bearerToken = "Bearer invalid.token";

        when(jwtService.extractEmail(any())).thenThrow(new RuntimeException("Invalid token"));

        ResponseEntity<?> response = authController.loginUser(bearerToken);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid token format", response.getBody());
    }

    @Test
    void testLoginUserByEmail() {
        String email = randomEmail();
        User mockUser = createUser(email);

        when(userService.findByEmail(email)).thenReturn(mockUser);

        ResponseEntity<?> response = authController.loginUserByEmail(email);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(mockUser, response.getBody());
        verify(userService).findByEmail(email);
    }
}