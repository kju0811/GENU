package dev.mvc.member;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

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

    /** 멤버 단건 조회 */
    @GetMapping("/read/{memberNo}")
    public ResponseEntity<Member> read(@PathVariable Long memberNo) {
        Member member = memberService.findByMemberNo(memberNo);
        return ResponseEntity.ok(member);
    }

    /** 멤버 수정 */
    @PutMapping("/{memberNo}")
    public ResponseEntity<Member> update(@PathVariable Long memberNo,
                                         @RequestBody Member updatedMember) {
        return memberService.findByMemberNoOptional(memberNo).map(existingMember -> {
            existingMember.setMemberName(updatedMember.getMemberName());
            existingMember.setMemberPw(updatedMember.getMemberPw()); // 추후 별도 API로 분리 가능
            existingMember.setMemberTel(updatedMember.getMemberTel());
            existingMember.setZipcode(updatedMember.getZipcode());
            existingMember.setAddress1(updatedMember.getAddress1());
            existingMember.setAddress2(updatedMember.getAddress2());
            existingMember.setMemberNick(updatedMember.getMemberNick());

            return ResponseEntity.ok(memberService.save(existingMember));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** 멤버 삭제 */
    @DeleteMapping("/{memberNo}")
    public ResponseEntity<Void> delete(@PathVariable Long memberNo) {
        if (memberService.findByMemberNoOptional(memberNo).isPresent()) {
            memberService.deleteEntity(memberNo);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
