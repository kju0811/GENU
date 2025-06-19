package dev.mvc.communitylike;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import dev.mvc.coin.Coin;
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
@Entity @Setter @Getter @ToString
public class Communitylike {
  
  /** 커뮤니티 좋아요 번호 (PK) */
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "communitylike_seq")
  @SequenceGenerator(name = "communitylike_seq", sequenceName = "COMMUNITYLIKE_SEQ", allocationSize = 1)
  @Column(name = "communitylike_no")
  private Long communitylike_no;

  /** 좋아요 누른 날짜 */
  @Column(name = "communitylike_date", nullable = false)
  private String communitylike_date;

  /** 회원번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "member_no", nullable = false)
  private Member member;
  
  /** 커뮤니티번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "community_no", nullable = false)
  private Community community;

}
