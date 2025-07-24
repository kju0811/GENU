package dev.mvc.member;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import dev.mvc.exception.MemberNotFoundException;
import dev.mvc.news.News;
import dev.mvc.pay.PayService;
import dev.mvc.team4.Home;
import dev.mvc.team4.JwtService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/member")
public class MemberController {
    private final MemberService memberService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PayService payService;
    
    private final Path storageLocation = Paths.get(Home.getUploadDir());

    public MemberController(MemberService memberService, JwtService jwtService,
        AuthenticationManager authenticationManager, PayService payService
    ) {
        this.memberService = memberService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.payService = payService;
        try {
            Files.createDirectories(this.storageLocation);
        } catch (IOException e) {
            throw new RuntimeException("회원 이미지 저장 폴더 생성 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 멤버 생성
     * @param member
     * @return
     */
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Member> create(
        @RequestPart("member") Member member,
        @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        try {
            if (file != null && !file.isEmpty()) {
                String original = file.getOriginalFilename();
                String lower = original.toLowerCase();
                if (lower.endsWith(".jpg")
                 || lower.endsWith(".jpeg")
                 || lower.endsWith(".png")
                ) {
                  
                  // 파일명
                  member.setMember_img(original);
                  
                    Path dest = storageLocation.resolve(
                        Paths.get(original)
                        ).normalize().toAbsolutePath();
                    
                    if (!dest.getParent().equals(storageLocation.toAbsolutePath())) {
                        return ResponseEntity.notFound().build();
                    }
                    // 파일 시스템에 저장
                    file.transferTo(dest);

                }
            }
            Member saved = memberService.save(member);
            payService.firstadditional(member, 10000000); // 기본금 지급
            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /** 전체 회원 목록 (페이징X) */
    @GetMapping("/list")
    public ResponseEntity<List<Member>> findAll() {
        List<Member> list = memberService.findAll();
        return ResponseEntity.ok(list);
    }

    /** 회원 페이징 조회 */
    @GetMapping("/page")
    public ResponseEntity<Page<Member>> findPage(Pageable pageable) {
        Page<Member> page = memberService.findAllByDateDesc(pageable);
        return ResponseEntity.ok(page);
    }

    /** 키워드 검색 페이징 조회 */  
    @GetMapping("/search")
    public ResponseEntity<Page<Member>> search(
        @RequestParam("kw") String keyword,
        Pageable pageable
    ) {
        Page<Member> page = memberService.searchKeyword(keyword, pageable);
        return ResponseEntity.ok(page);
    }

    /** 로그인 처리 */
    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody AccountCredentials credentials) {
        UsernamePasswordAuthenticationToken token =
            new UsernamePasswordAuthenticationToken(
                credentials.memberId(),
                credentials.memberPw()
                );
        
        Member member = memberService.findByMemberId(credentials.memberId())
            .orElseThrow(() -> new IllegalArgumentException("아이디가 존재하지 않습니다.")); // 이거뭐임
        Authentication auth = authenticationManager.authenticate(token);
        // 토큰 생성
        String jwt = jwtService.getToken(auth.getName(), member.getRole(),member.getMember_no());
        // 토큰을 AUTHORIZATION 헤더로 전송
        return ResponseEntity.ok()
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwt)
            .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.AUTHORIZATION).build();
    }

    /** 로그아웃 */
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        
        JSONObject json = new JSONObject();
        json.put("logout", true);
        json.put("sw", false);
        json.put("member_no", 0);
        json.put("res", "LOGOUT_OK");
        
        return json.toString();
    }

    /** 회원 단건 조회 */
    @GetMapping("/read/{member_no}")
    public ResponseEntity<Member> read(@PathVariable("member_no") Long member_no) {
        Member m = memberService.findByMember_no(member_no);
        return ResponseEntity.ok(m);
    }

    /** 회원 수정 */
    @PutMapping("/{member_no}")
    public ResponseEntity<Member> update(
        @PathVariable Long member_no,
        @RequestBody Member updated
    ) {
        return memberService.findByMemberNoOptional(member_no)
            .map(existing -> {
                existing.setMember_name(updated.getMember_name());
                existing.setMemberPw(updated.getMemberPw());
                existing.setMember_tel(updated.getMember_tel());
                existing.setZipcode(updated.getZipcode());
                existing.setAddress1(updated.getAddress1());
                existing.setAddress2(updated.getAddress2());
                existing.setMember_nick(updated.getMember_nick());
                Member saved = memberService.save(existing);
                return ResponseEntity.ok(saved);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** 회원 삭제 */
    @DeleteMapping("/{member_no}")
    public ResponseEntity<Void> delete(@PathVariable Long member_no) {
        if (memberService.findByMemberNoOptional(member_no).isPresent()) {
            memberService.deleteEntity(member_no);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    /** 권한 수정 */
    @PutMapping("/role/{member_no}")
    public ResponseEntity<Member> role(@PathVariable("member_no") Long member_no,
    								   @RequestBody Member updated) {
    	return memberService.findByMemberNoOptional(member_no)
    			.map(role -> {
    				role.setMember_grade(updated.getMember_grade());
    				Member saved = memberService.save(role);
    				return ResponseEntity.ok(saved);
    			})
    			.orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // 마이페이지 정보 조회 (JWT 인증 기반)
    @GetMapping("/mypage")
    public ResponseEntity<Member> findByMemberNoOptional(Long member_no) {
      return ResponseEntity.ok().build();
    }

    // 마이페이지 정보 수정
    @PostMapping("/mypage")
    public ResponseEntity<?> updateMyPage(@PathVariable Long member_no, @RequestBody Member update) {
      Member member = memberService.updateMyPage(member_no, update);
        return ResponseEntity.ok(member);
    }

    // 이미지
    @PostMapping("/change-profileImage/{member_no}")
    public ResponseEntity<?> changeProfileImage(
      @PathVariable Long member_no,
      @RequestPart MultipartFile file) {
      String fileName = file.getOriginalFilename();
      Path dest = Paths.get("C:\\kd\\deploy\\team4_v2sbm3c\\home\\storage", fileName); // 경로 맞게!
      try {
          file.transferTo(dest);
          // 서비스 레이어 통해 업데이트!
          memberService.updateProfileImage(member_no, fileName);
          return ResponseEntity.ok(fileName);
      } catch (IOException e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 실패");
      }
    }

    // 비밀번호 변경
    @PostMapping("/change-pw")
    public ResponseEntity<?> changePassword(
        @AuthenticationPrincipal Member member,
        @RequestBody Map<String, String> req // oriPassword, newPassword
    ) {
        if (member == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 필요");
        String oriPassword = req.get("oriPassword");
        String newPassword = req.get("newPassword");
        
        memberService.changePassword(member, oriPassword, newPassword);
        return ResponseEntity.ok("비밀번호 변경 성공");
    }
    
    /**
     * 아이디 찾기 (이름+전화번호+생년월일)
     * @param memberDTO
     * @return
     */
    @PostMapping("/find_by_id")
    public ResponseEntity<String> findbyid(@RequestBody MemberDTO memberDTO){
      String id = memberService.findId(memberDTO);
      return ResponseEntity.ok(id);
    }
    
    /**
     * 비밀번호 찾기 -> 메일로 인증번호
     * @param memberId
     * @return
     */
    @PostMapping("/find_by_pw")
    public ResponseEntity<?> findByPw(@RequestParam("memberId") String memberId) {
        try {
            memberService.findPw(memberId);  // 메일 전송 요청
            return ResponseEntity.ok("인증번호가 메일로 발송되었습니다.");
        } catch (MemberNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러가 발생했습니다.");
        }
    }
    
    /**
     * 인증번호 체크 
     * @param authCode
     * @param member_no
     * @return
     */
    @PostMapping("/check_code/{member_no}")
    public ResponseEntity<?> checkAuthCode(@PathVariable("member_no") Long member_no,
                                                        @RequestParam("authCode") String authCode) {
        try {
            memberService.checkAuthCode(authCode, member_no);
            return ResponseEntity.ok("인증 성공");
        } catch (IllegalArgumentException e) {
          return ResponseEntity.badRequest().body(e.getMessage()); // 사용자 입력 오류
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }
    
    /**
     * 새로운 비밀번호를 입력받아 갱신
     * @param member_no
     * @param new_pw
     * @return
     */
    @PostMapping("/new_pw/{member_no}")
    public ResponseEntity<?> new_member_pw(@PathVariable("member_no") Long member_no,
                                                          @RequestParam("new_pw") String new_pw){
      try {
        memberService.new_member_pw(member_no, new_pw);
        return ResponseEntity.ok("새로운 비밀번호로 변경되었습니다.");
      } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage()); // 사용자 입력 오류
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
      }
    }
    
    @PatchMapping("/update/grade")
    public ResponseEntity<?> updateCnt(@RequestBody MemberDTO dto) {
        Optional<Member> optionalMember = memberService.findByMemberNoOptional(dto.getMember_no());
        if (optionalMember.isPresent()) {
        	Member member = optionalMember.get();
        	member.setMember_grade(dto.getGrade());
            memberService.save(member);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    
}
