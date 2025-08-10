package dev.mvc.pay;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import dev.mvc.deal.Deal;
import dev.mvc.member.Member;
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

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity @Getter @Setter @ToString
public class Pay {
  /**
   * 금액 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="pay_seq")
  @SequenceGenerator(name="pay_seq", sequenceName="PAY_SEQ", allocationSize=1)
  @Column(name = "pay_no", updatable = false)
  private Long pay_no;
  
  /** 자산 */
  @Column(name = "pay_pay", nullable = false)
  private Integer pay_pay;
  
  /** 0:운영자 지급, 1:매수 체결, 2:매도 체결, 3:매수 주문, 5:매수 주문 취소*/
  @Column(name = "pay_type", nullable = false)
  private int pay_type = 0;
  
  /** 돈 이용 날짜 */
  @Column(name = "pay_date")
  private LocalDateTime pay_date;
  
  /**
   * member 테이블에 member_no를 참조
   */
  @ManyToOne
  @JoinColumn(name="member_no", referencedColumnName = "member_no", nullable = false)
  private Member member;
  
  /**
   * deal 테이블에 deal_no를 참조
   */
  @ManyToOne
  @JoinColumn(name="deal_no", referencedColumnName = "deal_no")
  private Deal deal;
  
  /** 시간 자동으로 넣어준다. */
  @PrePersist
  public void prePersist() {
      if (pay_date == null) {
        pay_date = LocalDateTime.now();
      }
  }
  
}
