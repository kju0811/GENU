package dev.mvc.communityreply;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

import dev.mvc.community.Community;
import dev.mvc.member.Member;

/**
 * 커뮤니티 댓글 엔티티
 * 테이블명: reply
 */
@NoArgsConstructor
@AllArgsConstructor
@Entity @Getter @Setter @ToString
public class CommunityReply {

  /** 커뮤니티 댓글 번호 (PK) */
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "communityreply_seq")
  @SequenceGenerator(name = "communityreply_seq", sequenceName = "COMMUNITYREPLY_SEQ", allocationSize = 1)
  @Column(name = "communityreply_no")
  private Long communityReplyNo;

  /** 댓글 내용 */
  @Column(name = "communityreply_content", nullable = false, length = 600)
  private String communityReplyContent;

  /** 댓글 작성일 */
  @Column(name = "communityreply_date", nullable = false)
  private LocalDateTime communityReplyDate;

  /** 회원번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "member_no", nullable = false)
  private Member member;

  /** 커뮤니티번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "community_no", nullable = false)
  private Community community;

  /** 댓글 생성 시 자동 시간 설정 */
  @PrePersist
  public void prePersist() {
    if (this.communityReplyDate == null) {
      this.communityReplyDate = LocalDateTime.now();
    }
  }
}
