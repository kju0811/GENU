package dev.mvc.reply;

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
import dev.mvc.community.Community;
import dev.mvc.member.Member;

//CREATE TABLE reply (
//    reply_no  NUMBER(10)  NOT NULL    PRIMARY KEY,
//      member_no NUMBER(10)  NOT NULL,   -- FK
//    community_no NUMBER(10)  NOT NULL,       -- FK
//    reply_content VARCHAR(600)  NOT NULL,
//    reply_date  DATE  NOT NULL,
//      FOREIGN KEY (member_no) REFERENCES member (member_no),
//      FOREIGN KEY (community_no) REFERENCES community (community_no)
//  );

@NoArgsConstructor
@AllArgsConstructor
@Entity @Setter @Getter @ToString
public class Reply {
  
  /** 커뮤니티 댓글 번호 (PK) */
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reply_seq")
  @SequenceGenerator(name = "reply_seq", sequenceName = "REPLY_SEQ", allocationSize = 1)
  @Column(name = "reply_no")
  private Long reply_no;
  
  /** 댓글 내용 */
  @Column(name = "reply_content", nullable = false, length = 600)
  private String reply_content;

  /** 댓글 작성일 */
  @Column(name = "reply_date", nullable = false)
  private String reply_date;
  
  /** 회원번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "member_no", nullable = false)
  private Member member;

  /** 커뮤니티번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "community_no", nullable = false)
  private Community community;

}
