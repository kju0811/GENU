package dev.mvc.communitylike;

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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

import dev.mvc.community.Community;
import dev.mvc.member.Member;

//CREATE TABLE communitylike (
//    communitylike_no  NUMBER(10)  NOT NULL    PRIMARY KEY,
//    member_no NUMBER(10)  NOT NULL, -- FK
//    community_no     NUMBER(10)  NOT NULL, -- FK
//    communitylike_date  DATE  NOT NULL,
//    FOREIGN KEY (member_no) REFERENCES member (member_no),
//    FOREIGN KEY (community_no) REFERENCES community (community_no)
//  );

@NoArgsConstructor
@AllArgsConstructor
@Entity @Setter @Getter @ToString @Builder
public class Communitylike {
  
  /** 커뮤니티 좋아요 번호 (PK) */
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "communitylike_seq")
  @SequenceGenerator(name = "communitylike_seq", sequenceName = "COMMUNITYLIKE_SEQ", allocationSize = 1)
  @Column(name = "communitylike_no")
  private Long communitylikeNo;

  /** 좋아요 누른 날짜 */
  @Column(name = "communitylike_date", nullable = false, columnDefinition = "DATE")
  private LocalDateTime communitylikeDate;

  /** 회원번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "member_no", nullable = false, referencedColumnName = "member_no",
      columnDefinition = "NUMBER(10)")
  private Member member;
  
  /** 커뮤니티번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "community_no", nullable = false, referencedColumnName = "community_no",
      columnDefinition = "NUMBER(10)")
  private Community community;
  
  @PrePersist
  public void prePersist() {
    if (this.communitylikeDate == null) {
      this.communitylikeDate = LocalDateTime.now();
    }
  }

}
