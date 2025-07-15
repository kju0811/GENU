package dev.mvc.deal;

import dev.mvc.coin.Coin;
import dev.mvc.member.Member;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class DealDTO {
  
  /** 매수 주문 DTO */
  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class DealBuyPay {
      @NotNull(message = "원하는 매수 금액을 입력해주세요.")
      @Min(value = 50, message = "매수 금액은 1 누렁 이상이어야 합니다.")
      private Integer price;
      
      @NotNull(message = "갯수를 입력해주세요.")
      @Min(value = 1, message = "갯수는 1개 이상이어야 합니다.")
      private Integer cnt;
      
      private int type=1; // 매수
      private int fee=0;
      
      private Coin coin;
      private Member member;
      
      public Deal toEntity() {
        return Deal.builder()
                .coin(coin)
                .deal_price(price)
                .deal_cnt(cnt)
                .deal_type(type)
                .deal_fee(fee)
                .member(member)

                .build();
    }
  }
  
  /** 매도 주문 DTO */
  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class DealSellPay {
      @NotNull(message = "원하는 매도 금액을 입력해주세요.")
      @Min(value = 50, message = "매도 금액은 1 누렁 이상이어야 합니다.")
      private Integer price;
      
      @NotNull(message = "갯수를 입력해주세요.")
      @Min(value = 1, message = "갯수는 1개 이상이어야 합니다.")
      private Integer cnt;
      
      private int type=2; // 매도
      private int fee=0;
      
      private Coin coin;
      private Member member;

      public Deal toEntity() {
        return Deal.builder()
                .coin(coin)
                .deal_price(price)
                .deal_cnt(cnt)
                .deal_type(type)
                .deal_fee(fee)
                .member(member)

                .build();
    }
  }
  
  /** 호가창을 위한 DTO */
  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class OrderList {
      private int deal_price;
      private int total_cnt;
  }
  
  
}
