package dev.mvc.member;

import java.util.Optional;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final MemberRepository memberRepository;

    public UserDetailsServiceImpl(MemberRepository repository) {
        this.memberRepository = repository;
    }

    /**
     * username: 이름이 아니라 로그인시 사용되는 아이디를 나타냄.
     */
    @Override
    public UserDetails loadUserByUsername(String memberId) throws UsernameNotFoundException {
        System.out.println("-> UserDetailsServiceImpl.java loadUserByUsername: " + memberId);
        
        // JPA, MyBATIS process class 호출
        Optional<Member> user = memberRepository.findByMemberId(memberId); // member_id: 회원 id
        
        UserBuilder builder = null;
        if (user.isPresent()) { // 회원이 존재하면
        	Member currentUser = user.get(); // Member 객체 추출

          builder = org.springframework.security.core.userdetails.User.withUsername(memberId); // 회원 아이디 전달
          builder.password(currentUser.getMemberPw()); // 회원 패스워드
          // builder.authorities(currentUser.getRole());
          builder.roles(currentUser.getRole()); // 회원 권한, ADMIN -> ROLE_ADMIN으로 변경
          
          System.out.println("-> currentUser.member_id: " + currentUser.getMemberId());          
          System.out.println("-> currentUser.getRole(): " + currentUser.getMember_grade());
          
        } else {
            throw new UsernameNotFoundException("사용자가 없습니다.");
        }
        return builder.build();
    }
    
    
}

