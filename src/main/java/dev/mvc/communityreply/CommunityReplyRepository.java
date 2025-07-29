package dev.mvc.communityreply;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import jakarta.transaction.Transactional;

public interface CommunityReplyRepository extends JpaRepository<CommunityReply, Long> {

    @Transactional
    @Modifying
    void deleteByCommunity_CommunityNo(Long communityNo);
}
