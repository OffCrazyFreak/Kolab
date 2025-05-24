package kolab.service;

public interface JwtService {
    String extractEmail(String token);
}