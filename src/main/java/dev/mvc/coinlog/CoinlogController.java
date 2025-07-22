package dev.mvc.coinlog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.coin.Coin;
import dev.mvc.coinlike.CoinlikeRepository;
import lombok.RequiredArgsConstructor;

@RequestMapping(value = "/coinlog")
@RestController
@RequiredArgsConstructor
public class CoinlogController {
  private final CoinlogService coinlogService;
  
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
  
  /**
   * 전체 목록
   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
   * http://localhost:9100/issue/find_all
   * @return
   */
  @GetMapping(value = "/find_all")
  public List<Coinlog> find_all() {
    return coinlogService.find_all();
  }
  
  /**
   * DELETE 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
   * http://localhost:9100/coinlog/21
   * @param id
   * @return
   */
  @DeleteMapping(value = "/{coinlog_no}")
  public ResponseEntity<Void> deleteEntity(@PathVariable("coinlog_no") Long id) {
    if (coinlogService.find_by_id(id).isPresent()) { // Entity가 존재하면
      coinlogService.deleteEntity(id); // 삭제
      return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
    } else {
      return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
    }
  }
  
  /**
   * 코인 chart 기능
   * @param coin_no
   * @param days
   * @return
   */
  @GetMapping("/ohlc/{coin_no}")
  public List<Object[]> getDailyOhlcData(@PathVariable("coin_no") Long coin_no, 
                                                 @RequestParam(name = "days", defaultValue = "30" ) int days){
    return coinlogService.getDailyOhlcData(coin_no, days);
  }
  

  
}
