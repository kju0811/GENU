package dev.mvc.coin;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Entity @Setter @Getter @ToString
public class Coin {
  /**
   * 코인 번호 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="coin_seq")
  @SequenceGenerator(name="coin_seq", sequenceName="COIN_SEQ", allocationSize=1)
  @Column(name = "coin_no", updatable = false)
  private Long coin_no;
  
  /** 코인 이름 */
  @Column(name = "coin_name", nullable = false)
  private String coin_name;
  
  /** 코인 가격 */
  @Column(name = "coin_price", nullable = false)
  private Integer coin_price=0;
  
  /** 코인 생성일, sysdate 자동생성 */
  @Column(name = "coin_date", columnDefinition = "DATE", nullable = false)
  private LocalDate coin_date;
  
  /** 코인 정보 */
  @Lob
  @Column(name = "coin_info", nullable = false)
  private String coin_info="";
  
}
