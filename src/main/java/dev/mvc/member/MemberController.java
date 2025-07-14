package dev.mvc.member;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.List;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
        @RequestParam("word") String keyword,
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
    public ResponseEntity<Member> read(@PathVariable Long member_no) {
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
}
