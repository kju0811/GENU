package dev.mvc.team4;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import org.springframework.http.HttpHeaders;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;

// 토큰 관련 설정
@Component
public class JwtService {
    static final long EXPIRATIONTIME = 86400000;  // 1일, 밀리초
    static final String PREFIX = "Bearer"; // 토큰의 접두사, Bearer 구조

    // 비밀키 생성
    static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // 서명된 JWT 토큰 생성
    public String getToken(String memberId, String role) {
        String token = Jwts.builder()
            .setSubject(memberId)
            .claim("role", role)
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME)).signWith(key).compact();
        return token;
    }

    // 요청의 Authorization header에서 토큰을 확인하고 아이디(username)을 가져옴
    public String getAuthUser(HttpServletRequest request) {
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (token != null) {
            String user = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token.replace(PREFIX, ""))
                    .getBody().getSubject();
            if (user != null)
                return user;
        }
        return null;
    }
    
    /**
     * 요청의 Authorization 헤더에서 토큰을 파싱해
     * role 클레임을 꺼내 권한 반환
     */
    public String getUserRole(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith(PREFIX)) {
            String token = header.substring(PREFIX.length());
            
            System.out.println("-> JwtService.java token: " + token);
            
            Claims claims = Jwts.parserBuilder()
                                .setSigningKey(key)
                                .build()
                                .parseClaimsJws(token)
                                .getBody();
            String role = claims.get("role", String.class);
            
            System.out.println("-> JwtService.java role: " + role);
            
            return role;
        }
        
        return null;
    }    
}

