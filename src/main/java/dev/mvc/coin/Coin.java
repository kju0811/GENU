package dev.mvc.coin;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity @Setter @Getter @ToString
public class Coin {
  /**
   * 코인 번호 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="coin_seq")
  @SequenceGenerator(name="coin_seq", sequenceName="COIN_SEQ", allocationSize=1)
  private Long coin_no;
  
  /** 코인 이름 */
  private String coin_name;
  
  /** 코인 가격 */
  private Integer coin_price=0;
  
  /** 코인 생성일, sysdate 자동생성 */
  private String coin_date;
  
  /** 코인 정보 */
  private String coin_info="";
  
  public Coin() {
    
  }
  
  public Coin(String coin_name, String coin_date, int coin_price, String coin_info) {
    this.coin_name=coin_name;
    this.coin_date=coin_date;
    this.coin_price=coin_price;
    this.coin_info=coin_info;
  }
}
