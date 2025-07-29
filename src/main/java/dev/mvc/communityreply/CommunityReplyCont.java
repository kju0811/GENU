package dev.mvc.communityreply;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RequestMapping("/communityreply")
@RestController
@RequiredArgsConstructor
public class CommunityReplyCont {

    private final CommunityReplyService service;

    /** 댓글 작성 */
    @PostMapping("/create")
    public ResponseEntity<CommunityReply> create(@RequestBody CommunityReply reply) {
        service.save(reply);
        return ResponseEntity.ok(reply);
    }

    /** 게시글별 댓글 목록(ASC, 페이징) */
    @GetMapping("/community/{communityNo}")
    public Page<CommunityReply> listByCommunity(
        @PathVariable("communityNo") Long communityNo,
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "size", defaultValue = "10") int size
    )  {
        return service.findByCommunityNo(communityNo, PageRequest.of(page, size));
    }
    
 // 댓글 개수 반환 API (⭐️ 프론트에서 이걸 fetch)
    @GetMapping("/community/{communityNo}/count")
    public long countByCommunity(@PathVariable("communityNo") Long communityNo) {
        return service.countByCommunityNo(communityNo);
    }

    /** 댓글 삭제 */
    @DeleteMapping("/delete/{communityreply_no}")
    public ResponseEntity<Void> delete(@PathVariable("communityreply_no") Long id) {
        if (service.findById(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    /** 댓글 수정 */
    @PutMapping("/update/{communityreply_no}")
    public ResponseEntity<CommunityReply> update(@PathVariable("communityreply_no") Long id,
                                                 @RequestBody CommunityReply reply) {
        return service.findById(id).map(existing -> {
            existing.setCommunityReplyContent(reply.getCommunityReplyContent());
            service.save(existing);
            return ResponseEntity.ok(existing);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
