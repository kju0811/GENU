package dev.mvc.pay;

import dev.mvc.member.Member;
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

@NoArgsConstructor
@AllArgsConstructor
@Entity @Getter @Setter @ToString
public class Pay {
  /**
   * 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="pay_seq")
  @SequenceGenerator(name="pay_seq", sequenceName="PAY_SEQ", allocationSize=1)
  @Column(name = "pay_no", updatable = false)
  private Long pay_no;
  
  /**
   * member 테이블에 member_no를 참조
   */
  @ManyToOne
  @JoinColumn(name="member_no", referencedColumnName = "member_no", nullable = false)
  private Member member;
  
  /** 자산 */
  @Column(name = "pay", nullable = false)
  private Integer pay;
  
  /** 기록일 */
  @Column(name = "pay_date", columnDefinition = "DATE", nullable = false)
  private String pay_date;
  
  /** 0:+, 1:- */
  @Column(name = "pay_type", nullable = false)
  private int pay_type = 0;
      
}
