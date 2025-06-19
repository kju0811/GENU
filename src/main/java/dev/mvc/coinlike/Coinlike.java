package dev.mvc.coinlike;

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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Entity @Getter @Setter @ToString
@Table(  // 유니크 제약조건 추가
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"member_no", "coin_no"})
    }
)
public class Coinlike {
  /**
   * 코인좋아요 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="coinlike_seq")
  @SequenceGenerator(name="coinlike_seq", sequenceName="COINLIKE_SEQ", allocationSize=1)
  @Column(name = "coinlike_no", updatable = false)
  private Long coinlike_no;

  /** 거래 날짜 */
  @Column(name = "coinlike_date", nullable = false)
  private LocalDateTime coinlike_date;
  
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
