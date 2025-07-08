package dev.mvc.member;

import java.util.List;

import org.json.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.team4.JwtService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

//    @GetMapping("/create")
//    public String create() {
//        return "member/create";
//    }

    /** 멤버 생성 */
    @PostMapping("/create")
    public ResponseEntity<Member> create(@RequestBody Member member) {
        Member savedMember = memberService.save(member);
        return ResponseEntity.ok(savedMember);
    }

    /** 멤버 전체 목록 조회 */
    @GetMapping("/list")
    public ResponseEntity<List<Member>> findAll() {
        List<Member> members = memberService.findAll();
        return ResponseEntity.ok(members);
    }
    
    /**
     * 로그인 처리 Authorization Header: Bearer + JWT 토큰
     * @param credentials
     * @return
     */
    @PostMapping("/login")
    public ResponseEntity<?> getToken(@RequestBody AccountCredentials credentials) {
      UsernamePasswordAuthenticationToken creds = new UsernamePasswordAuthenticationToken(credentials.memberId(),
          credentials.memberPw());
      
      Member member = memberService.findByMemberId(credentials.memberId()).get();
      Authentication auth = authenticationManager.authenticate(creds);
      
      // 토큰 생성
      String jwts = jwtService.getToken(auth.getName(), member.getRole());
      
      // 토큰을 AUTHORIZATION 헤더로 전송
      return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, "Bearer" + jwts)
          .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization").build();
    }
    
    /**
     * 로그아웃
     * @param session
     * @return
     */
    @GetMapping(path="/logout")
    public String logout(HttpSession session) {
      session.invalidate(); // 모든 세션 변수 초기화
      
      JSONObject json = new JSONObject();
      json.put("logout", true); // logout 성공 여부
      json.put("sw", false);     // login 여부, React 전역 변수와 대응
      json.put("member_no", 0);
      json.put("res", "LOGOUT_OK");
      
      return json.toString();
    }
    

    /** 멤버 단건 조회 */
    @GetMapping("/read/{member_no}")
    public ResponseEntity<Member> read(@PathVariable Long member_no) {
        Member member = memberService.findByMember_no(member_no);
        return ResponseEntity.ok(member);
    }

    /** 멤버 수정 */
    @PutMapping("/{member_no}")
    public ResponseEntity<Member> update(@PathVariable Long member_no,
                                         @RequestBody Member updatedMember) {
        return memberService.findByMemberNoOptional(member_no).map(existingMember -> {
            existingMember.setMember_name(updatedMember.getMember_name());
            existingMember.setMemberPw(updatedMember.getMemberPw()); // 추후 별도 API로 분리 가능
            existingMember.setMember_tel(updatedMember.getMember_tel());
            existingMember.setZipcode(updatedMember.getZipcode());
            existingMember.setAddress1(updatedMember.getAddress1());
            existingMember.setAddress2(updatedMember.getAddress2());
            existingMember.setMember_nick(updatedMember.getMember_nick());

            return ResponseEntity.ok(memberService.save(existingMember));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** 멤버 삭제 */
    @DeleteMapping("/{member_no}")
    public ResponseEntity<Void> delete(@PathVariable Long member_no) {
        if (memberService.findByMemberNoOptional(member_no).isPresent()) {
            memberService.deleteEntity(member_no);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
