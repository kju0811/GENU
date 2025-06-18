package dev.mvc.blocks;

import dev.mvc.member.Member;
import dev.mvc.reply.Reply;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

//  CREATE TABLE blocks (
//    blocker_no  NUMBER(10)  NOT NULL,
//    blocked_no  NUMBER(10)  NOT NULL,
//    FOREIGN KEY (blocker_no) REFERENCES member (member_no),
//    FOREIGN KEY (blocked_no) REFERENCES member (member_no)
//  );

@NoArgsConstructor
@AllArgsConstructor
@Entity @Setter @Getter @ToString
public class blocks {
  
  /** 차단하는 유저 번호 */
  @ManyToOne
  @JoinColumn(name = "blocker_no", referencedColumnName = "member_no" , nullable = false)
  private Member blocker;

  /** 차단당한 유저 번호 */
  @ManyToOne
  @JoinColumn(name = "blocked_no",referencedColumnName = "member_no", nullable = false)
  private Member blocked;

}
