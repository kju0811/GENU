package dev.mvc.pay;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.coin.Coin;
import dev.mvc.coinlike.CoinlikeRepository;
import dev.mvc.member.Member;
import lombok.RequiredArgsConstructor;

@RequestMapping(value = "/pay")
@RestController
@RequiredArgsConstructor
public class PayController {
  private final PayService payService;
  
  /**
   * 돈 생성
   * @param pay
   * @return
   */
  @PostMapping(value="/create")
  @ResponseBody
  public ResponseEntity<Pay> create(@RequestBody Pay pay) {
   payService.save(pay);
//    payService.additional(member, pay_pay);
    return ResponseEntity.ok().build();
  }
  
  /**
   * 전체 목록
   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
   * http://localhost:9093/pay/find_all
   * @return
   */
  @GetMapping(value = "/find_all")
  public List<Pay> find_all() {
    return payService.find_all();
  }
  
  /**
   * DELETE 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
   * http://localhost:9093/pay/21
   * @param pay_no
   * @return
   */
  @DeleteMapping(value = "/{pay_no}")
  public ResponseEntity<Void> deleteEntity(@PathVariable("pay_no") Long id) {
    if (payService.find_by_id(id).isPresent()) { // Entity가 존재하면
      payService.deleteEntity(id); // 삭제
      return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
    } else {
      return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
    }
  }
  
  /**
   * 수정
   * PUT 요청을 처리하여 특정 ID를 가진 Entity 객체를 업데이트
   * http://localhost:9093/pay/21
   * @param pay_no
   * @param entity
   * @return
   */
  @PutMapping(path = "/{pay_no}")
  public ResponseEntity<Pay> updateEntity(@PathVariable("pay_no") Long id, 
                                                                @RequestBody Pay pay) {
    // id를 이용한 레코드 조회 -> existingEntity 객체에 할당 -> {} 실행 값 저장 -> DBMS 저장 -> 상태 코드 200 출력
    return payService.find_by_id(id).<ResponseEntity<Pay>>map(existingPay -> {
      existingPay.setPay_pay(pay.getPay_pay());
      existingPay.setPay_type(pay.getPay_type());

      payService.save(existingPay);
      return ResponseEntity.ok().build(); // 200 반환
    }).orElseGet(() -> ResponseEntity.notFound().build()); // 찾지 못한 경우 404 반환
  }
  
}
