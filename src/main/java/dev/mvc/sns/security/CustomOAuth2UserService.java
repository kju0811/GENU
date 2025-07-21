package dev.mvc.sns.security;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import dev.mvc.member.Member;
import dev.mvc.member.MemberRepository;
import dev.mvc.pay.PayService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    
	@Autowired
	private MemberRepository memberRepository;
	@Autowired
	private PayService payService;
	
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
    	log.info("loadUser");
    	
    	OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();
        System.out.println("-> userNameAttributeName: " + userNameAttributeName);
        System.out.println("-> registrationId: " + registrationId);
        System.out.println("-> userNameAttributeName: " + userNameAttributeName);
        
        OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());

        String nameAttributeKey = attributes.getNameAttributeKey();
        String name = attributes.getName();
        String email = attributes.getEmail();
        String picture = attributes.getPicture();
        String id = attributes.getId();
        String socialType = "";

        // 임의의 닉네임 선언
        String nick = "";
        do {
          nick = generateUniqueNickName("user");
        } while (memberRepository.existsCheckNick(nick) > 0);

        if("naver".equals(registrationId)) {
        	socialType = "naver";
        }
        else if("kakao".equals(registrationId)) { // 현재 카카오는 없음
        	socialType = "kakao";
        } else {
        	socialType = "google";
        }
        
        System.out.println("-> loadUser email: " +email);
        
        if(name == null) name = "";
        if(email == null) email = "";
        
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_USER");
        authorities.add(authority);
        
        String memberId = email;
        String authProvider = socialType;
        Member memberEntity = null;
        
        if (memberRepository.existsByMemberId(memberId)) {
          memberEntity = memberRepository.findByMemberId(memberId).get();  // Optional unwrap
          System.out.println("-> 소셜 사용자 로딩: " + memberEntity.getMemberId());
      } else {
          System.out.println("-> 신규 소셜 사용자 등록: " + socialType);
          memberEntity = Member.builder()
              .memberId(memberId)
              .memberPw("1234")
              .member_name(name)
              .member_nick(nick)
              .member_tel("000-0000-0000")
              .memberBirth("00000000")
              .authProvider(authProvider)
              .member_grade(10)
              .build();
          memberEntity = memberRepository.save(memberEntity);
          
          System.out.println("생성된 멤버 번호 -> " + memberEntity.getMember_no());
          payService.firstadditional(memberEntity, 10000000); // 기본금 지급
      }

    		return new CustomUser(memberEntity.getMember_no(), email, name, authorities, attributes);
    }

    /** 닉네임 생성 */
    public String generateUniqueNickName(String baseName) {
      // baseName이 없으면 기본 "user"
      if (baseName == null || baseName.trim().isEmpty()) {
          baseName = "user";
      }
      // UUID나 랜덤 숫자 붙이기
      String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8); // 8자리 랜덤 문자열
      return baseName + uniqueSuffix;
  }
   
}