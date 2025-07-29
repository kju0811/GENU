package dev.mvc.communityreply;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityReplyService {

    private final CommunityReplyRepository repository;

    // 댓글 작성
    public void save(CommunityReply reply) {
        repository.save(reply);
    }

    // 전체 댓글 조회
    public List<CommunityReply> findAll() {
        return repository.findAll();
    }

    // ID로 댓글 조회
    public Optional<CommunityReply> findById(Long id) {
        return repository.findById(id);
    }

    // 댓글 삭제
    public void delete(Long id) {
        repository.deleteByCommunity_CommunityNo(id);
        repository.deleteById(id);
    }
}
