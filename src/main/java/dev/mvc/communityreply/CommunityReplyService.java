package dev.mvc.communityreply;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // 게시글별 댓글(오래된 순, ASC)
    public Page<CommunityReply> findByCommunityNo(Long communityNo, Pageable pageable) {
        return repository.findByCommunity_CommunityNoOrderByCommunityReplyDateAsc(communityNo, pageable);
    }
    
 // 댓글 수 반환
    public long countByCommunityNo(Long communityNo) {
        return repository.countByCommunity_CommunityNo(communityNo);
    }

    // ID로 댓글 조회
    public Optional<CommunityReply> findById(Long id) {
        return repository.findById(id);
    }

    // 댓글 삭제
    public void delete(Long id) {
      repository.deleteById(id); // ★ PK로만 삭제!
  }
}
