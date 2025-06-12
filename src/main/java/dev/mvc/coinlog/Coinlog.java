package dev.mvc.coinlog;

import java.util.Date;

import dev.mvc.coin.Coin;
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
public class Coinlog {
  /**
   * 코인기록번호 식별자
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="coinlog_seq")
  @SequenceGenerator(name="coinlog_seq", sequenceName="COINLOG_SEQ", allocationSize=1)
  private Long coinlog_no;
  
  /** 코인기록 시간 */
  private Date coinlog_time;
  
  /** 코인기록 가격 */
  private Integer coinlog_price;
  
  /** 코인의 외래키 */
  @ManyToOne
  @JoinColumn(name="coin_no")  // referencedColumnName = "coin_no" 이름 같으면 생략 가능
  private Coin coin;

  public Coinlog() {
    
  }
  
  public Coinlog(Date coinlog_time, int coinlog_price) {
    this.coinlog_time = coinlog_time;
    this.coinlog_price = coinlog_price;
  }
}
