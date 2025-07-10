package dev.mvc.reply;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reply")
public class ReplyController {

    private final ReplyService replyService;

    /** 댓글 등록 */
    @PostMapping("/create")
    public ResponseEntity<Reply> create(@RequestBody Reply reply) {
        return ResponseEntity.ok(replyService.save(reply));
    }

    /** 댓글 전체 조회 */
    @GetMapping("/list")
    public ResponseEntity<List<Reply>> findAll() {
        return ResponseEntity.ok(replyService.findAll());
    }

    /** 댓글 단건 조회 */
    @GetMapping("/read/{reply_no}")
    public ResponseEntity<Reply> read(@PathVariable("reply_no") Long id) {
        return replyService.findByReplyNoOptional(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** 댓글 수정 */
    @PutMapping("/{reply_no}")
    public ResponseEntity<Reply> update(@PathVariable("reply_no") Long id,
                                        @RequestBody Reply updated) {
        return replyService.findByReplyNoOptional(id).map(existing -> {
            existing.setReply_content(updated.getReply_content());
            existing.setReplyDate(updated.getReplyDate());
            existing.setMember(updated.getMember());
            existing.setCommunity(updated.getCommunity());

            return ResponseEntity.ok(replyService.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** 댓글 삭제 */
    @DeleteMapping("/{reply_no}")
    public ResponseEntity<Void> delete(@PathVariable("reply_no") Long id) {
        if (replyService.findByReplyNoOptional(id).isPresent()) {
            replyService.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build(); 
        }
    }
}
