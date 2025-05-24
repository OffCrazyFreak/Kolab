package kolab.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import kolab.service.JwtService;
import org.springframework.stereotype.Service;

@Service
public class JwtServiceImpl implements JwtService {

    @Override
    public String extractEmail(String token) {
        try {
            GoogleIdToken idToken = GoogleIdToken.parse(new GsonFactory(), token);
            GoogleIdToken.Payload payload = idToken.getPayload();
            return payload.getEmail();
        } catch (Exception e) {
            throw new RuntimeException("Invalid Google token", e);
        }
    }
}