package dev.mvc.coin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(value = "/coin")
@RestController
public class CoinController {
  @Autowired
  CoinService coinService;
    
  /**
   * 코인 생성
   * @param coin
   * @return
   */
  @PostMapping(value="/create")
  @ResponseBody
  public ResponseEntity<Coin> create(@RequestBody Coin coin) {
    Coin savedEntity =  coinService.save(coin);
    return ResponseEntity.ok(savedEntity);
  }
  
    /**
     * 수동으로 변동하기
     */
  @PostMapping(value="/allchange")
  public void allchange() {
    coinService.updateAllCoinPrices();
    System.out.println("ok");
  }
  
  /**
   * 전체 목록
   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
   * http://localhost:9093/coin/find_all
   * @return
   */
  @GetMapping(value = "/find_all")
  public List<Coin> find_all() {
    return coinService.find_all();
  }
  
  /**
   * find_by_id 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
   * http://localhost:9093/coin/21
   * @param coin_no
   * @return
   */
  @GetMapping(value = "/{coin_no}")
  public ResponseEntity<Coin> find_by_id(@PathVariable("coin_no") Long id) {
    return coinService.find_by_id(id).map(result -> ResponseEntity.ok(result)).orElseGet(() -> ResponseEntity.notFound().build());
  }
  
  /**
   * DELETE 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
   * http://localhost:9093/coin/21
   * @param coin_no
   * @return
   */
  @DeleteMapping(value = "/{coin_no}")
  public ResponseEntity<Void> deleteEntity(@PathVariable("coin_no") Long id) {
    if (coinService.find_by_id(id).isPresent()) { // Entity가 존재하면
      coinService.deleteEntity(id); // 삭제
      return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
    } else {
      return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
    }
  }
  
  /**
   * 수정
   * PUT 요청을 처리하여 특정 ID를 가진 Entity 객체를 업데이트
   * http://localhost:9093/coin/21
   * @param coin_no
   * @param entity
   * @return
   */
  @PutMapping(path = "/{coin_no}")
  public ResponseEntity<Coin> updateEntity(@PathVariable("coin_no") Long id, 
                                                                @RequestBody Coin coin) {
    // id를 이용한 레코드 조회 -> existingEntity 객체에 할당 -> {} 실행 값 저장 -> DBMS 저장 -> 상태 코드 200 출력
    return coinService.find_by_id(id).<ResponseEntity<Coin>>map(existingCoin -> {
      existingCoin.setCoin_name(coin.getCoin_name());
      existingCoin.setCoin_info(coin.getCoin_info());
      
      coinService.save(existingCoin);
      return ResponseEntity.ok().build(); // 200 반환
    }).orElseGet(() -> ResponseEntity.notFound().build()); // 찾지 못한 경우 404 반환
  }
  
}
