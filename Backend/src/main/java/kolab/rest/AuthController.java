package kolab.rest;

import kolab.domain.User;
import kolab.service.UserService;
import kolab.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

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

    // TODO: remove when connected to frontend JWT so you can use the endpoint above
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
}