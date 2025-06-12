package dev.mvc.pay;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity @Getter @Setter @ToString
public class Pay {
  /**
   * 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="pay_seq")
  @SequenceGenerator(name="pay_seq", sequenceName="PAY_SEQ", allocationSize=1)
  private long pay_no;
  
  /** 자산 */
  private Integer pay;
  
  /** 기록일 */
  private Date pay_date;
  
  /** 0:+, 1:- */
  private int pay_type;
  
//  @ManyToOne
//  @JoinColumn(name=member_no)
//  private Member member;
  
}
