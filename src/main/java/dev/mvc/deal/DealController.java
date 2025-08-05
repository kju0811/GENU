package dev.mvc.deal;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping(value = "/deal")
@RestController
@RequiredArgsConstructor
public class DealController {
  private final DealService dealService;
  
//  /**
//   * 거래 생성
//   * @param deal
//   * @return
//   */
//  @PostMapping(value="/create")
//  @ResponseBody
//  public ResponseEntity<Deal> create(@RequestBody Deal deal) {
//    dealService.save(deal);
//    return ResponseEntity.ok().build();
//  }
  
//  /**
//   * 전체 목록
//   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
//   * http://localhost:9093/deal/find_all
//   * @return
//   */
//  @GetMapping(value = "/find_all")
//  public List<Deal> find_all() {
//    return dealService.find_all();
//  }
//  
//  /**
//   * DELETE 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
//   * http://localhost:9093/deal/21
//   * @param deal_no
//   * @return
//   */
//  @DeleteMapping(value = "/{deal_no}")
//  public ResponseEntity<Void> deleteEntity(@PathVariable("deal_no") Long id) {
//    if (dealService.find_by_id(id).isPresent()) { // Entity가 존재하면
//      dealService.deleteEntity(id); // 삭제
//      return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
//    } else {
//      return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
//    }
//  }
//  
//  /**
//   * 수정
//   * PUT 요청을 처리하여 특정 ID를 가진 Entity 객체를 업데이트
//   * http://localhost:9093/deal/21
//   * @param deal_no
//   * @param entity
//   * @return
//   */
//  @PutMapping(path = "/{deal_no}")
//  public ResponseEntity<Deal> updateEntity(@PathVariable("deal_no") Long id, 
//                                                                @RequestBody Deal deal) {
//    // id를 이용한 레코드 조회 -> existingEntity 객체에 할당 -> {} 실행 값 저장 -> DBMS 저장 -> 상태 코드 200 출력
//    return dealService.find_by_id(id).<ResponseEntity<Deal>>map(existingDeal -> {
//      existingDeal.setDeal_cnt(deal.getDeal_cnt());
//      existingDeal.setDeal_type(deal.getDeal_type());
//      
//      dealService.save(existingDeal);
//      return ResponseEntity.ok().build(); // 200 반환
//    }).orElseGet(() -> ResponseEntity.notFound().build()); // 찾지 못한 경우 404 반환
//  }
 
  /**
   * 매수 주문
   * @param member_no
   * @return
   */
  @PostMapping(value = "/buydeal")
  public ResponseEntity<?> buydeal(@Valid @RequestBody DealDTO.DealBuyPay dto) {
    Deal deal = dealService.buydeal(dto);
    if (deal == null) {
      return ResponseEntity.badRequest().body("매수 주문 실패: 유효하지 않은 데이터입니다.");
    }
    return ResponseEntity.ok(deal);
  }
  
  /**
   * 매도 주문
   * @param member_no
   * @return
   */
  @PostMapping(value = "/selldeal")
  public ResponseEntity<?> selldeal(@Valid @RequestBody DealDTO.DealSellPay dto) {
    Deal deal = dealService.selldeal(dto);
    if (deal == null) {
      return ResponseEntity.badRequest().body("매도 주문 실패: 유효하지 않은 데이터입니다.");
    }
    return ResponseEntity.ok(deal);
  }
  
  /**
   * 해당 매수 주문을 취소하는 메서드
   * @param deal_no
   * @return
   */
  @PostMapping(value = "/buydeal/cancel/{deal_no}")
  public ResponseEntity<Void> cancelBuyDeal(@PathVariable("deal_no") Long deal_no){
    dealService.cancelBuyDeal(deal_no);
    return ResponseEntity.ok().build();
  }
  
  /**
   * 해당 매도 주문을 취소하는 메서드
   * @param deal_no
   * @return
   */
  @PostMapping(value = "/selldeal/cancel/{deal_no}")
  public ResponseEntity<Void> cancelSellDeal(@PathVariable("deal_no") Long deal_no){
    dealService.cancelSellDeal(deal_no);
    return ResponseEntity.ok().build();
  }
  
  /**
   * 호가창 : 주문의 가격과 갯수 리스트 반환
   * @param coin_no
   * @return
   */
  @GetMapping(value = "/orderlist/{coin_no}")
  public List<DealDTO.OrderList> orderlist(@PathVariable("coin_no") Long coin_no){
    return dealService.getOrderList(coin_no);
  }
  
  /**
   * React가 최신글 100건을 수신받아 React에서 페이징을 처리함.
   * 기간을 적용한 검색, page: 0~
   * http://localhost:9093/deal/find_all_by_order_by_rdate_desc_paging?page=0&size=3
   * @param start_date
   * @param end_date
   * @return
   */
  @GetMapping(path = "/find_deal_by_member/{member_no}")
  public List<Deal> find_deal_by_member(@PathVariable(name="member_no") Long member_no,
                                                   @RequestParam(name="page", defaultValue = "0") Integer page, 
                                                   @RequestParam(name="size", defaultValue = "1000") Integer size) {
    Page<Deal> pages = dealService.find_deal_by_member(member_no, page, size);
    List<Deal> list = pages.getContent(); // 페이징 목록 추출
    
    return list;
  }
  
  /**
   * React가 최신글 100건을 수신받아 React에서 페이징을 처리함.
   * 기간을 적용한 검색, page: 0~
   * http://localhost:9093/deal/find_all_by_order_by_rdate_desc_paging?page=0&size=3
   * @param start_date
   * @param end_date
   * @return
   */
  @GetMapping(path = "/find_deal_by_member_search/{member_no}")
  public List<Deal> find_deal_by_member_search(@PathVariable(name="member_no") Long member_no,
                                                                         @RequestParam(name="word", defaultValue = "") String coin_name,
                                                                         @RequestParam(name="page", defaultValue = "0") Integer page, 
                                                                         @RequestParam(name="size", defaultValue = "1000") Integer size) {
    Page<Deal> pages = dealService.find_deal_by_member_search(member_no, coin_name, page, size);
    List<Deal> list = pages.getContent(); // 페이징 목록 추출
    
    return list;
  }
  
  /**
   * 멤버가 가지고 있는 coin의 갯수 반환
   * @param member_no
   * @param coin_no
   * @return
   */
  @GetMapping(value = "/get_total_cnt/{member_no}/{coin_no}")
  public int getTotalCnt(@PathVariable(name="member_no") Long member_no,
                              @PathVariable(name="coin_no") Long coin_no) {
    return dealService.getTotalCnt(member_no, coin_no);
  }

  /**
   * 멤버가 해당 코인에 주문한 거래내역 날짜 내림차 순 반환
   * http://localhost:9093/deal/find_deal_by_member_coin/1/1
   * @param member_no
   * @param coin_no
   * @return
   */
  @GetMapping(path = "/find_deal_by_member_coin/{member_no}/{coin_no}")
  public List<Deal> find_deal_by_member_coin(@PathVariable(name="member_no") Long member_no,
                                                     @PathVariable(name="coin_no") Long coin_no) {
    List<Deal> list = dealService.find_deal_by_member_coin(member_no, coin_no);
   
    return list;
  }
  
  /** 하루치 매수량 조회 */
  @GetMapping("/buy-total/{coin_no}")
  public ResponseEntity<Integer> getTotalBuy(@PathVariable("coin_no") Long coin_no) {
      Integer result = dealService.getTotalType1(coin_no);
      return ResponseEntity.ok(result);
  }

  /** 하루치 매도량 조회 */
  @GetMapping("/sell-total/{coin_no}")
  public ResponseEntity<Integer> getTotalSell(@PathVariable("coin_no") Long coin_no) {
      Integer result = dealService.getTotalType2(coin_no);
      return ResponseEntity.ok(result);
  }
  
  /**
   * 멤버가 해당 코인에 주문한 거래내역 날짜 내림차 순 반환
   * http://localhost:9093/deal/find_deal_by_member_coin_twoweek/1
   * @param member_no
   * @return
   */
  @GetMapping(path = "/find_deal_by_member_coin_twoweek/{member_no}")
  public List<Deal> find_deal_by_member_coin_twoweek(@PathVariable(name="member_no") Long member_no) {
    List<Deal> list = dealService.find_deal_by_member_coin_twoweek(member_no);
   
    return list;
  }
  
  /** 단일 평단가 반환 */
  @GetMapping("/get_one_asset/{member_no}/{coin_no}")
  public ResponseEntity<?> get_one_asset(@PathVariable(name="member_no") Long member_no, @PathVariable("coin_no") Long coin_no) {
    try {
      DealDTO.AssetInfo assets = dealService.one_asset(member_no, coin_no);
      if (assets == null) return ResponseEntity.ok(null);
      return ResponseEntity.ok(assets);
    } catch (EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러");
    }
  }
  
  /** 멤버가 가지고 있는 자산내역 */
  @GetMapping("/get_member_asset/{member_no}")
  public ResponseEntity<?> get_member_asset(@PathVariable(name="member_no") Long member_no) {
    try {
      List<DealDTO.MyAssetList> assets = dealService.get_member_asset(member_no);
      return ResponseEntity.ok(assets);
    } catch (EntityNotFoundException e) {
      e.printStackTrace();  // 에러 상세 로그 출력
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
      e.printStackTrace();  // 에러 상세 로그 출력
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러");
    }
  }
  
  // 체결강도 + 순매수량 반환
  @GetMapping("/coin-strength/{coin_no}")
  public ResponseEntity<Map<String, Object>> getStrengthInfo(@PathVariable("coin_no") Long coin_no) {
      Map<String, Object> result = dealService.getStrengthAndNetBuy(coin_no);
      return ResponseEntity.ok(result);
  }
  
  
  /**
   * 멤버가 해당 코인에 체결된 거래내역(매수/매도 완료) 날짜 내림차 순 반환
   * http://localhost:9093/deal/find_confirmed_deal_by_member_coin/{member_no}/{coin_no}
   */
  @GetMapping(path = "/find_confirmed_deal_by_member_coin/{member_no}/{coin_no}")
  public List<Deal> find_confirmed_deal_by_member_coin(@PathVariable(name="member_no") Long member_no,
                                                       @PathVariable(name="coin_no") Long coin_no) {
    // deal_type 1(매수완료), 2(매도완료)만 리턴해야 함
    return dealService.find_confirmed_deal_by_member_coin(member_no, coin_no);
  }
  
   
}
