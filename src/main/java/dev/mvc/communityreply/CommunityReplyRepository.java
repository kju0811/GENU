package dev.mvc.communityreply;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

public interface CommunityReplyRepository extends JpaRepository<CommunityReply, Long> {
  // 오래된 순(ASC)
  Page<CommunityReply> findByCommunity_CommunityNoOrderByCommunityReplyDateAsc(Long communityNo, Pageable pageable);

  // 댓글 개수 반환
  @Query("SELECT COUNT(r) FROM CommunityReply r WHERE r.community.communityNo = :communityNo")
  long countByCommunity_CommunityNo(@Param("communityNo") Long communityNo);
}
