package dev.mvc.coinlog;

import java.time.LocalDateTime;

import dev.mvc.coin.Coin;
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
public class Coinlog {
  /**
   * 코인기록번호 식별자
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="coinlog_seq")
  @SequenceGenerator(name="coinlog_seq", sequenceName="COINLOG_SEQ", allocationSize=1)
  @Column(name = "coinlog_no", updatable = false)
  private Long coinlog_no;
  
  /** 코인의 외래키 */
  @ManyToOne
  @JoinColumn(name="coin_no", referencedColumnName = "coin_no", nullable = false)
  private Coin coin;
  
  /** 코인기록 시간 */
  @Column(name = "coinlog_time", nullable = false)
  private LocalDateTime coinlog_time;
  
  /** 코인기록 가격 */
  @Column(name = "coinlog_price", nullable = false)
  private Integer coinlog_price;
  
  /** 코인기록 등락률 */
  @Column(name = "coinlog_percentage", columnDefinition = "NUMBER(5,2)", nullable = false)
  private double coinlog_percentage=0.00;
  
}
