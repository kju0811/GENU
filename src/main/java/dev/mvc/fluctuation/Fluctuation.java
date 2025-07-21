package dev.mvc.fluctuation;

import java.time.LocalDateTime;

import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.annotation.JsonBackReference;

import dev.mvc.coin.Coin;
import dev.mvc.news.News;
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

@AllArgsConstructor
@NoArgsConstructor
@Entity @Getter @Setter @ToString
public class Fluctuation {
  /**
   * 기사에 의한 변동률을 참조하기 위한 엔티티
   * 코인변동 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="fluctuation_seq")
  @SequenceGenerator(name="fluctuation_seq", sequenceName="FLUCTUATION_SEQ", allocationSize=1)
  @Column(name = "fluctuation_no", updatable = false)
  private Long fluctuation_no;
  
  /** 코인변동 생성일, sysdate 자동생성 */
  @Column(name = "fluctuation_date", nullable = false)
  private LocalDateTime fluctuation_date;
  
  /**
   * news 테이블에 news_no를 참조
   */
  @ManyToOne
  @JoinColumn(name="news_no", referencedColumnName = "news_no", nullable = false)
  @JsonBackReference
  private News news;
  
  /**
   * coin 테이블에 coin_no를 참조
   */
  @ManyToOne
  @JoinColumn(name="coin_no", referencedColumnName = "coin_no", nullable = false)
  private Coin coin;
  
}
