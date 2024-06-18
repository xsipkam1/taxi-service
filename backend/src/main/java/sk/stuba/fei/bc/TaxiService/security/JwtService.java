package sk.stuba.fei.bc.TaxiService.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.*;


@Service
public class JwtService implements IJwtService{

    @Value("${taxiservice.app.secretKey}")
    private String SECRET_KEY;
    private final Set<String> invalidatedTokens = new HashSet<>();

    @Override
    public String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getBody().getSubject();
    }

    @Override
    public Jws<Claims> getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
    }

    @Override
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plusSeconds(1440)))
                .signWith(getSigningKey())
                .compact();
    }

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token) && !invalidatedTokens.contains(token);
    }

    @Override
    public boolean isTokenExpired(String token) {
        return getClaimsFromToken(token).getBody().getExpiration().before(Date.from(Instant.now()));
    }

    @Override
    public SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    @Override
    public String extractJwtToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        return (authHeader != null && authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;
    }

    @Override
    public void invalidateToken(String token) {
        invalidatedTokens.add(token);
    }
}
