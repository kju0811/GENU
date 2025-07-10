package dev.mvc.community;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
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
//    community_title VARCHAR2(200) NOT NULL,
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
  private Long community_no;

  /** 커뮤니티 제목 */
  @Column(name = "community_title", nullable = false, length = 200)
  private String community_title;

  /** 커뮤니티 본문 내용 */
  @Lob
  @Column(name = "community_content", nullable = false)
  private String community_content;

  /** 조회수 */
  @Column(name = "community_cnt", nullable = false)
  private Integer community_cnt = 0;

  /** 작성일 */
  @Column(name = "community_date", nullable = false, columnDefinition = "DATE")
  private LocalDateTime communityDate;
  
  /** 회원번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "member_no", nullable = false)
  private Member member;

  /** 코인번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "coin_no", nullable = false)
  private Coin coin;

}
