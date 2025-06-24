package dev.mvc.deal;

import dev.mvc.coin.Coin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class DealDTO {
  
  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class DealPay {
      @NotNull(message = "투자 금액을 입력해주세요.")
      @Min(value = 50, message = "투자 금액은 1 누렁 이상이어야 합니다.")
      private int price;
      
      @NotNull(message = "갯수를 입력해주세요.")
      @Min(value = 1, message = "갯수는 1개 이상이어야 합니다.")
      private int cnt;
      
      private Coin coin;

      public Deal toEntity() {
        return Deal.builder()
                .coin(coin)
                .deal_price(price)
                .deal_cnt(cnt)

                .build();
    }
  }
  
  
}
