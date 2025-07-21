package dev.mvc.sns.security;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import dev.mvc.member.Member;
import dev.mvc.member.MemberRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import static dev.mvc.sns.security.RedirectUrlCookieFilter.REDIRECT_URI_PARAM;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
@Component
public class OAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private static final String LOCAL_REDIRECT_URL = "http://localhost:3000";
	
	private final MemberRepository memberRepository;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException {
		
		TokenProvider tokenProvider = new TokenProvider();
//		String token = tokenProvider.create(authentication);
		
    // CustomUser로부터 Member 정보 가져오기
    CustomUser customUser = (CustomUser) authentication.getPrincipal();
    Long memberId = customUser.getId();
    Optional<Member> optionalMember = memberRepository.findById(memberId);
    Member member = optionalMember.orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));
    
    // 1번 방식으로 JWT 생성 (role, member_no 포함)
    
    String token = tokenProvider.create(member);
		log.info("token {}", token);

		Optional<Cookie> oCookie = Arrays.stream(request.getCookies())
				.filter(cookie -> cookie.getName().equals(REDIRECT_URI_PARAM))
				.findFirst();
		Optional<String> redirectUri = oCookie.map(Cookie::getValue);

		log.info("redirectUri {}", redirectUri);

		String email = ((CustomUser)authentication.getPrincipal()).getEmail();
		System.out.println("-> OAuthSuccessHandler email: " + email);
		
		// Frontend: <Route path="/sociallogin" element={<SocialLogin />} />
		String targetUrl = redirectUri.orElseGet(() -> LOCAL_REDIRECT_URL) + "/sociallogin?token=" + token + "&email=" + email;

		log.info("targetUrl {}", targetUrl);

		response.sendRedirect(targetUrl);
	}

}

