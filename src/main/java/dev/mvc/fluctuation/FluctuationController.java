package dev.mvc.fluctuation;

import java.util.List;

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

@RequestMapping(value = "/fluctuation")
@RequiredArgsConstructor
@RestController
public class FluctuationController {
  private final FluctuationService fluctuationService;
  
  /**
   * 코인변동 생성
   * @param fluctuation
   * @return
   */
  @PostMapping(value="/create")
  @ResponseBody
  public ResponseEntity<Fluctuation> create(@RequestBody Fluctuation fluctuation) {
    fluctuationService.save(fluctuation);
    return ResponseEntity.ok().build();
  }
  
  /**
   * 전체 목록
   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
   * http://localhost:9093/fluctuation/find_all
   * @return
   */
  @GetMapping(value = "/find_all")
  public List<Fluctuation> find_all() {
    return fluctuationService.find_all();
  }
  
  /**
   * DELETE 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
   * http://localhost:9093/fluctuation/21
   * @param id
   * @return
   */
  @DeleteMapping(value = "/{fluctuation_id}")
  public ResponseEntity<Void> deleteEntity(@PathVariable("fluctuation_id") Long id) {
    if (fluctuationService.find_by_id(id).isPresent()) { // Entity가 존재하면
      fluctuationService.deleteEntity(id); // 삭제
      return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
    } else {
      return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
    }
  }
  
  /**
   * 수정
   * PUT 요청을 처리하여 특정 ID를 가진 Entity 객체를 업데이트
   * http://localhost:9093/fluctuation/21
   * @param id
   * @param entity
   * @return
   */
  @PutMapping(path = "/{fluctuation_id}")
  public ResponseEntity<Fluctuation> updateEntity(@PathVariable("fluctuation_id") Long id, 
                                                                @RequestBody Fluctuation fluctuation) {
    // id를 이용한 레코드 조회 -> existingEntity 객체에 할당 -> {} 실행 값 저장 -> DBMS 저장 -> 상태 코드 200 출력
    return fluctuationService.find_by_id(id).<ResponseEntity<Fluctuation>>map(existingFluctuation -> {
      existingFluctuation.setCoin(fluctuation.getCoin());

      fluctuationService.save(existingFluctuation);
      return ResponseEntity.ok().build(); // 200 반환
    }).orElseGet(() -> ResponseEntity.notFound().build()); // 찾지 못한 경우 404 반환
  }

  /**
   * 날짜에 포함하는 레코드 목록
   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
   * http://localhost:9093/fluctuation/숫자
   * @return
   */
  @GetMapping(value = "/{coin_no}")
  public List<Long> findByRdatePeriod(@PathVariable("coin_no") Long coin_no) {
    return fluctuationService.findByRdatePeriod(coin_no);
  }
  
}
