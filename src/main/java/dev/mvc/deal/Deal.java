package dev.mvc.deal;

import java.time.LocalDateTime;

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
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Entity @Getter @Setter @ToString
public class Deal {
  /**
   * 거래 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="deal_seq")
  @SequenceGenerator(name="deal_seq", sequenceName="DEAL_SEQ", allocationSize=1)
  @Column(name = "deal_no", updatable = false)
  private Long deal_no;

  /** 거래 날짜 */
  @Column(name = "deal_date", nullable = false)
  private LocalDateTime deal_date;
  
  /** 거래시 매매 갯수 */
  @Column(name = "deal_cnt", nullable = false)
  private Integer deal_cnt;
  
  /** 거래 수수료 */
  @Column(name = "deal_fee", nullable = false)
  private Integer deal_fee;
  
  /** 1: 매수 0: 매도 */
  @Min(0)
  @Max(1)
  @Column(name = "deal_type", nullable = false)
  private int deal_type=1;
  
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
