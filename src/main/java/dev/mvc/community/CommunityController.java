package dev.mvc.community;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityController {

    private final CommunityService communityService;

    /** 커뮤니티 글 등록 */
    @PostMapping("/create")
    public ResponseEntity<Community> create(@RequestBody Community community) {
        Community saved = communityService.save(community);
        return ResponseEntity.ok(saved);
    }

    /** 커뮤니티 글 전체 목록 조회 */
    @GetMapping("/list")
    public ResponseEntity<List<Community>> findAll() {
        return ResponseEntity.ok(communityService.findAll());
    }

    /** 커뮤니티 글 단건 조회 */
    @GetMapping("/read/{community_no}")
    public ResponseEntity<Community> read(@PathVariable("community_no") Long community_no) {
        return communityService.findByCommunityNoOptional(community_no)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** 커뮤니티 글 수정 */
    @PutMapping("/{community_no}")
    public ResponseEntity<Community> update(@PathVariable("community_no") Long community_no,
                                            @RequestBody Community updated) {
        return communityService.findByCommunityNoOptional(community_no).map(existing -> {
            existing.setCommunity_title(updated.getCommunity_title());
            existing.setCommunity_content(updated.getCommunity_content());
            existing.setCommunity_cnt(updated.getCommunity_cnt()); // 추후 삭제예정
            existing.setCommunity_date(updated.getCommunity_date()); // 추후 삭제예정
            existing.setCoin(updated.getCoin());       // 무슨 코인의 커뮤니티인지
            existing.setMember(updated.getMember());   // 작성자도 변경 가능? (보통은 안 하긴 함)

            return ResponseEntity.ok(communityService.save(existing));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** 커뮤니티 글 삭제 */
    @DeleteMapping("/{community_no}")
    public ResponseEntity<Void> delete(@PathVariable("community_no") Long community_no) {
        if (communityService.findByCommunityNoOptional(community_no).isPresent()) {
            communityService.deleteById(community_no);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
