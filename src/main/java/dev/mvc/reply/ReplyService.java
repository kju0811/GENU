package dev.mvc.reply;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReplyService {

    private final ReplyRepository replyRepository;

    /** 등록 또는 수정 */
    public Reply save(Reply reply) {
        return replyRepository.save(reply);
    }

    /** 전체 댓글 목록 조회 */
    public List<Reply> findAll() {
        return replyRepository.findAll();
    }

    /** 단건 조회 (Optional 반환) */
    public Optional<Reply> findByReplyNoOptional(Long reply_no) {
        return replyRepository.findById(reply_no);
    }

    /** 삭제 */
    public void deleteById(Long reply_no) {
        replyRepository.deleteById(reply_no);
    }
}
