package dev.mvc.replylike;

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
import dev.mvc.reply.Reply;
import dev.mvc.member.Member;

//  CREATE TABLE replylike (
//      replylike_no  NUMBER(10)  NOT NULL    PRIMARY KEY,
//      member_no NUMBER(10)  NOT NULL, -- FK
//      reply_no     NUMBER(10)  NOT NULL, -- FK
//      replylike_date  DATE  NOT NULL,
//      FOREIGN KEY (member_no) REFERENCES member (member_no),
//      FOREIGN KEY (reply_no) REFERENCES reply (reply_no)
//    );

@NoArgsConstructor
@AllArgsConstructor
@Entity @Setter @Getter @ToString
public class replylike {
  
  /** 댓글 좋아요 번호 (PK) */
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "replylike_seq")
  @SequenceGenerator(name = "replylike_seq", sequenceName = "REPLYLIKE_SEQ", allocationSize = 1)
  @Column(name = "replylike_no")
  private Long replylike_no;
  
  /** 댓글 좋아요 생성일 */
  @Column(name = "replylike_date", nullable = false)
  private String replylike_date;  

  /** 회원번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "member_no", nullable = false)
  private Member member;
  
  /** 댓글번호 외래키 */
  @ManyToOne
  @JoinColumn(name = "reply_no", nullable = false)
  private Reply reply;

  
}
