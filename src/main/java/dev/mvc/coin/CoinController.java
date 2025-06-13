package dev.mvc.coin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@RequestMapping(value = "/coin")
@Controller
public class CoinController {
  @Autowired
  CoinService coinService;
  
  @GetMapping(value="/create")
  public void create() {
   
  }
  
  @PostMapping(value="/create")
  @ResponseBody
  public ResponseEntity<Coin> create(@RequestBody Coin coin) {
    coinService.save(coin);
    return ResponseEntity.ok().build();
  }
  
  @PostMapping(value="/allchange")
  public void allchange() {
    coinService.updateAllCoinPrices();
    System.out.println("ok");
  }
  
}
