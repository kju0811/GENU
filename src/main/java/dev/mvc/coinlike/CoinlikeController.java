package dev.mvc.coinlike;

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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.deal.Deal;
import lombok.RequiredArgsConstructor;

@RequestMapping(value = "/coinlike")
@RestController
@RequiredArgsConstructor
public class CoinlikeController {
  private final CoinlikeService coinlikeService;
  
  /**
   * 코인좋아요 생성
   * @param coinlike
   * @return
   */
  @PostMapping(value="/create")
  @ResponseBody
  public ResponseEntity<Coinlike> create(@RequestBody Coinlike coinlike) {
    coinlikeService.save(coinlike);
    return ResponseEntity.ok().build();
  }
  
  /**
   * 전체 목록
   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
   * http://localhost:9093/coinlike/find_all
   * @return
   */
  @GetMapping(value = "/find_all")
  public List<Coinlike> find_all() {
    return coinlikeService.find_all();
  }
  
  /**
   * DELETE 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
   * http://localhost:9093/coinlike/21
   * @param id
   * @return
   */
  @DeleteMapping(value = "/{coinlike_no}")
  public ResponseEntity<Void> deleteEntity(@PathVariable("coinlike_no") Long id) {
    if (coinlikeService.find_by_id(id).isPresent()) { // Entity가 존재하면
      coinlikeService.deleteEntity(id); // 삭제
      return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
    } else {
      return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
    }
  }
  
  /**
   * 수정
   * PUT 요청을 처리하여 특정 ID를 가진 Entity 객체를 업데이트
   * http://localhost:9093/coinlike/21
   * @param id
   * @param entity
   * @return
   */
  @PutMapping(path = "/{coinlike_no}")
  public ResponseEntity<Coinlike> updateEntity(@PathVariable("coinlike_no") Long id, 
                                                                @RequestBody Coinlike coinlike) {
    // id를 이용한 레코드 조회 -> existingEntity 객체에 할당 -> {} 실행 값 저장 -> DBMS 저장 -> 상태 코드 200 출력
    return coinlikeService.find_by_id(id).<ResponseEntity<Coinlike>>map(existingCoinlike -> {
      existingCoinlike.setCoinlike_date(coinlike.getCoinlike_date());
      
      coinlikeService.save(existingCoinlike);
      return ResponseEntity.ok().build(); // 200 반환
    }).orElseGet(() -> ResponseEntity.notFound().build()); // 찾지 못한 경우 404 반환
  }
}
