package dev.mvc.communityreply;

import java.util.List;

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

    /** 전체 댓글 목록 */
    @GetMapping("/findall")
    public List<CommunityReply> findAll() {
        return service.findAll();
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
