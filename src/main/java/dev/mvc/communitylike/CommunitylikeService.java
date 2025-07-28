package dev.mvc.communitylike;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunitylikeService {

    private final CommunitylikeRepository repository;

    // 좋아요 저장
    public void save(Communitylike like) {
        repository.save(like);
    }

    // 전체 좋아요 조회
    public List<Communitylike> find() {
        return repository.findAll();
    }

    // ID로 좋아요 단건 조회
    public Optional<Communitylike> findbyid(Long id) {
        return repository.findById(id);
    }

    // 커뮤니티 글 전체 좋아요 삭제 (communityNo 기준)
    public void deleteAllByCommunityId(Long communityNo) {
        repository.deleteByCommunity_CommunityNo(communityNo);
    }

    // 개별 좋아요 삭제 (PK 기준)
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
