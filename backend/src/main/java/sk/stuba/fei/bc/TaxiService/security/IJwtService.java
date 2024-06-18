package sk.stuba.fei.bc.TaxiService.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.util.Map;

public interface IJwtService {
    String getUsernameFromToken(String token);

    Jws<Claims> getClaimsFromToken(String token);

    String generateToken(Map<String, Object> extraClaims, UserDetails userDetails);

    boolean isTokenValid(String token, UserDetails userDetails);

    boolean isTokenExpired(String token);

    SecretKey getSigningKey();

    String extractJwtToken(HttpServletRequest request);

    void invalidateToken(String token);
}
