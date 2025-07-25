package dev.mvc.coin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoinDTO {
  private Long coin_no;
  private int coin_price;
  private String coin_img;
}
