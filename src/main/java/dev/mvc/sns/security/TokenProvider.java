package dev.mvc.sns.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import dev.mvc.member.Member;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Service
public class TokenProvider {

  @Value("${security.secret-key}")
  private String SECRET_KEY;
  
  private static Key SIGNING_KEY;
  
  @PostConstruct
  public void init() { // 의존성 주입 후 자동실행.
    SIGNING_KEY = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
  }
  
	static final long EXPIRATIONTIME = 86400000;  // 1일, 밀리초
	
	public String create(Member memberEntity) {
		Date expiryDate = Date.from(Instant.now().plus(1, ChronoUnit.DAYS));  // 1일 유지

		 String token = Jwts.builder()
//		      .signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
//		      .setSubject(String.valueOf(memberEntity.getMemberId()))
//		      .setIssuer("demo app")
//		      .setIssuedAt(new Date())
         .setSubject(memberEntity.getMemberId())
         .claim("role", memberEntity.getRole())
         .claim("member_no", memberEntity.getMember_no())
         .setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME)).signWith(SIGNING_KEY).compact();
     System.out.println("1번 진행중 -> Bearer " + token);
    return "Bearer " + token;
	}

	public String validateAndGetUserId(String token) {
		Claims claims = Jwts.parserBuilder()
            .setSigningKey(SIGNING_KEY)
            .build()
            .parseClaimsJws(token)
            .getBody();

		return claims.getSubject();
	}

  public String create(final Authentication authentication) {
		CustomUser userPrincipal = (CustomUser) authentication.getPrincipal();
		
		String token = Jwts.builder()
			.setSubject(userPrincipal.getName())
			.setIssuedAt(new Date())
			.signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
			.setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME)).signWith(SIGNING_KEY).compact();
		
		System.out.println("2번 진행중 -> Bearer " + token);
    return "Bearer " + token;
	}

	public String createByUserId(final Long userId) {
		Date expiryDate = Date.from(Instant.now().plus(1, ChronoUnit.DAYS));

		String token = Jwts.builder()
			.setSubject(String.valueOf(userId))
			.setIssuedAt(new Date())
			.signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
	    .setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME)).signWith(SIGNING_KEY).compact();
		
    return "Bearer " + token;
	}
}