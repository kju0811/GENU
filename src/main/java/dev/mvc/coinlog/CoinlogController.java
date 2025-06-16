package dev.mvc.coinlog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@RequestMapping(value = "/coinlog")
public class CoinlogController {
  @Autowired
  CoinlogService coinlogService;
  
  /**
   * 코인기록 생성
   * @param coin
   * @return
   */
  @PostMapping(value="/create")
  @ResponseBody
  public ResponseEntity<Coinlog> create(@RequestBody Coinlog coinlog) {
    coinlogService.save(coinlog);
    return ResponseEntity.ok().build();
  }
}
