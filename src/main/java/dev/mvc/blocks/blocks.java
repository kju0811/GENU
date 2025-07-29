package dev.mvc.blocks;

import dev.mvc.member.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(  // 유니크 제약조건 추가
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"blocker_no", "blocked_no"})
    }
)
public class blocks {
  /**
   * 차단 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="blocks_seq")
  @SequenceGenerator(name="blocks_seq", sequenceName="BLOCKS_SEQ", allocationSize=1)
  @Column(name = "blocks_no", updatable = false)
  private Long blocks_no;
  
  /** 차단하는 유저 번호 */
  @ManyToOne
  @JoinColumn(name = "blocker_no", referencedColumnName = "member_no" , nullable = false)
  private Member blocker;

  /** 차단당한 유저 번호 */
  @ManyToOne
  @JoinColumn(name = "blocked_no",referencedColumnName = "member_no", nullable = false)
  private Member blocked;

}
