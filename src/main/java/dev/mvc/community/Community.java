package dev.mvc.community;

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

import dev.mvc.coin.Coin;
import dev.mvc.member.Member;

// CREATE TABLE community (
//    community_no  NUMBER(10)  NOT NULL,
//    member_no NUMBER(10)  NOT NULL,   -- FK
//    coin_no NUMBER(10)  NOT NULL,       -- FK
//    community_content CLOB  NOT NULL,
//    community_cnt NUMBER(7) NOT NULL,
//    community_date  DATE  NOT NULL,
//    FOREIGN KEY (member_no) REFERENCES member (member_no),
//    FOREIGN KEY (coin_no) REFERENCES coin (coin_no)
//  );

@NoArgsConstructor
@AllArgsConstructor
@Entity @Setter @Getter @ToString
public class Community {

  /** 커뮤니티 글 번호 (PK) */
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "community_seq")
  @SequenceGenerator(name = "community_seq", sequenceName = "COMMUNITY_SEQ", allocationSize = 1)
  @Column(name = "community_no")
  private Long communityNo;

//  /** 커뮤니티 제목, 댓글식 커뮤니티를 위해 보류 */
//  @Column(name = "community_title", nullable = false, length = 200)
//  private String communityTitle;
  
  /** 커뮤니티 본문 내용 */
  @Column(name = "community_content", nullable = false, length = 2000)
  private String communityContent;

  /** 작성일 */
  @Column(name = "community_date", nullable = false, columnDefinition = "DATE")
  private LocalDateTime communityDate;
  
  /** 커뮤니티 이미지 */
  @Column(name = "community_img", nullable = true)
  private String communityImg="";
  
  /** 회원번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "member_no", nullable = false)
  private Member member;

  /** 코인번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "coin_no", nullable = false)
  private Coin coin;
  
  @PrePersist
  public void prePersist() {
    if (this.communityDate == null) {
      this.communityDate = LocalDateTime.now();
    }
  }

}
