package dev.mvc.coin;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter @Getter @ToString
public class CoinVO {
  /** 코인 번호, Sequence에서 자동 생성 */
  private Integer coin_no=0;
  
  /** 코인 이름 */
  private String coin_name;
  
  /** 코인 가격 */
  private Integer coin_price=0;
  
  /** 코인 생성일, sysdate 자동생성 */
  private String coin_date="";
  
  /** 코인 정보 */
  private String coin_info="";
  
}
