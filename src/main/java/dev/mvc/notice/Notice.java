package dev.mvc.notice;

import dev.mvc.coin.Coin;
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
public class Notice {
  /**
   * 알림 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="notice_seq")
  @SequenceGenerator(name="notice_seq", sequenceName="NOTICE_SEQ", allocationSize=1)
  @Column(name = "notice_no", updatable = false)
  private Long notice_no;
  
  /** 알림 금액 */
  @Column(name = "notice_price", nullable = false)
  private Integer notice_price;
  
  /**
   * member 테이블에 member_no를 참조
   */
  @ManyToOne
  @JoinColumn(name="member_no", referencedColumnName = "member_no", nullable = false)
  private Member member;
  
  /**
   * coin 테이블에 coin_no를 참조
   */
  @ManyToOne
  @JoinColumn(name="coin_no", referencedColumnName = "coin_no", nullable = false)
  private Coin coin;
}
