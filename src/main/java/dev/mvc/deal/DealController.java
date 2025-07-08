package dev.mvc.deal;

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

import dev.mvc.coin.Coin;
import dev.mvc.coinlike.CoinlikeRepository;
import dev.mvc.member.Member;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping(value = "/deal")
@RestController
@RequiredArgsConstructor
public class DealController {
  private final DealService dealService;
  
  /**
   * 출석 생성
   * @param deal
   * @return
   */
  @PostMapping(value="/create")
  @ResponseBody
  public ResponseEntity<Deal> create(@RequestBody Deal deal) {
    dealService.save(deal);
    return ResponseEntity.ok().build();
  }
  
  /**
   * 전체 목록
   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
   * http://localhost:9093/deal/find_all
   * @return
   */
  @GetMapping(value = "/find_all")
  public List<Deal> find_all() {
    return dealService.find_all();
  }
  
  /**
   * DELETE 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
   * http://localhost:9093/deal/21
   * @param deal_no
   * @return
   */
  @DeleteMapping(value = "/{deal_no}")
  public ResponseEntity<Void> deleteEntity(@PathVariable("deal_no") Long id) {
    if (dealService.find_by_id(id).isPresent()) { // Entity가 존재하면
      dealService.deleteEntity(id); // 삭제
      return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
    } else {
      return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
    }
  }
  
  /**
   * 수정
   * PUT 요청을 처리하여 특정 ID를 가진 Entity 객체를 업데이트
   * http://localhost:9093/deal/21
   * @param deal_no
   * @param entity
   * @return
   */
  @PutMapping(path = "/{deal_no}")
  public ResponseEntity<Deal> updateEntity(@PathVariable("deal_no") Long id, 
                                                                @RequestBody Deal deal) {
    // id를 이용한 레코드 조회 -> existingEntity 객체에 할당 -> {} 실행 값 저장 -> DBMS 저장 -> 상태 코드 200 출력
    return dealService.find_by_id(id).<ResponseEntity<Deal>>map(existingDeal -> {
      existingDeal.setDeal_cnt(deal.getDeal_cnt());
      existingDeal.setDeal_type(deal.getDeal_type());
      
      dealService.save(existingDeal);
      return ResponseEntity.ok().build(); // 200 반환
    }).orElseGet(() -> ResponseEntity.notFound().build()); // 찾지 못한 경우 404 반환
  }
 
  /**
   * 매수 주문 // 스프링 시큐리티하면 추가할 예정
   * @param member_no
   * @return
   */
  @PostMapping(value = "/buydeal")
  public ResponseEntity<Deal> buydeal(@Valid @RequestBody DealDTO.DealBuyPay dto) {
    dealService.buydeal(dto);
    return ResponseEntity.ok().build();
  }
  
  /**
   * 매도 주문 // 스프링 시큐리티하면 추가할 예정
   * @param member_no
   * @return
   */
  @PostMapping(value = "/selldeal")
  public ResponseEntity<Deal> selldeal(@Valid @RequestBody DealDTO.DealSellPay dto) {
    dealService.selldeal(dto);
    return ResponseEntity.ok().build();
  }
  
  /**
   * 주문의 가격과 갯수 리스트 반환
   * @param coin_no
   * @return
   */
  @GetMapping(value = "/orderlist/{coin_no}")
  public List<DealDTO.OrderList> orderlist(@PathVariable("coin_no") Long coin_no){
    return dealService.getOrderList(coin_no);
  }

}
