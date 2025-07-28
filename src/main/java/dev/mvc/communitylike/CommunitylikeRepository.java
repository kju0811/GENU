package dev.mvc.communitylike;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface CommunitylikeRepository extends JpaRepository<Communitylike, Long> {

    // 커뮤니티 글 PK로 전체 좋아요 삭제
    @Transactional
    @Modifying
    void deleteByCommunity_CommunityNo(Long communityNo);

}
