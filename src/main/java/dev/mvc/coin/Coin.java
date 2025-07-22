package dev.mvc.coin;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
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
  @Column(name = "coin_date", nullable = false)
  private LocalDateTime coin_date;
  
  /** 코인 카테고리 */
  @Column(name = "coin_cate", nullable = false)
  private String coin_cate="";
  
  /** 코인 정보 */
  @Lob
  @Column(name = "coin_info", nullable = false)
  private String coin_info="";
  
  /** 코인 등락률 */
  @Column(name = "coin_percentage", columnDefinition = "NUMBER(5,2)", nullable = false)
  private double coin_percentage=0.00;
  
  /** 코인 이미지 */
  @Column(name = "coin_img")
  private String coin_img="";
  
  /** 코인 진행중1, 상장폐지0 구분 */
  @Column(name = "coin_type", columnDefinition = "NUMBER(1)", nullable = false)
  private int coin_type = 1;
  
  /** 시간 자동으로 넣어준다. */
  @PrePersist
  public void prePersist() {
      if (coin_date == null) {
          coin_date = LocalDateTime.now();
      }
  }
}
