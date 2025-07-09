package dev.mvc.deal;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import dev.mvc.coin.Coin;
import dev.mvc.coin.CoinService;
import dev.mvc.coinlike.CoinlikeRepository;
import dev.mvc.member.Member;
import dev.mvc.pay.Pay;
import dev.mvc.pay.PayService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DealService {
  private final DealRepository dealRepository;
  private final PayService payService;
  private static final Logger logger = LoggerFactory.getLogger(DealService.class);
  
  /** Create, INSERT~, UPDATE~ */
  public void save(Deal deal) {
    dealRepository.save(deal); 
  }
  
  /** 거래 id에 해당하는 정보 반환 */
  public Optional<Deal> find_by_id(Long id) {
    return dealRepository.findById(id);  // method/SQL 자동 생성
  }
  
  /** 거래 id에 해당하는 거래 삭제 */
  public void deleteEntity(Long id) {
    dealRepository.deleteById(id);
  }
  
  /** 모든 레코드 출력 */
  public List<Deal> find_all() {
    return dealRepository.findAll();  // method/SQL 자동 생성
  }
  
  /** 멤버가 매수한 갯수 정보 반환 */
  public Integer getBuybyCnt(Long member_no, Long coin_no) {
    System.out.println("-> getDealbyCnt ok");
    return dealRepository.getBuybyCnt(member_no, coin_no);
  }
  
  /** 멤버가 매도한 갯수 정보 반환 */
  public Integer getSellbyCnt(Long member_no, Long coin_no) {
    System.out.println("-> getSellbyCnt ok");
    return dealRepository.getSellbyCnt(member_no, coin_no);
  }
  
  /** 매수 체결된 코인갯수 반환 */
  public Integer getTotalType1(Long coin_no) {
    System.out.println("-> getTotalType1 ok");
    return dealRepository.getTotalType1(coin_no);
  }
  
  /** 매도 체결된 코인갯수 반환 */
  public Integer getTotalType2(Long coin_no) {
    System.out.println("-> getTotalType2 ok");
    return dealRepository.getTotalType2(coin_no);
  }
  
  /** 예약 매수된 정보 반환 */
  public List<Deal> getType3(Long coin_no) {
    System.out.println("-> getType3 ok");
    return dealRepository.getType3(coin_no);
  }
  
  /** 예약 매수된 정보 반환 */
  public List<Deal> getType4(Long coin_no) {
    System.out.println("-> getType4 ok");
    return dealRepository.getType4(coin_no);
  }
  
  /** 매수 시 실행 */
  public Deal buydeal(DealDTO.DealBuyPay request) {
    //돈 서비스 getMemberPay 호출해서 비교하고
    int wp = payService.getMemberPay(request.getMember().getMember_no()); // 보유 자산
    System.out.println("현자산: " + wp);
    System.out.println("멤버no: " +request.getMember().getMember_no());
    int price = request.getPrice();
    int cnt = request.getCnt();
    int fee = feeCheck(price, cnt);
    int total = price*cnt+fee; // 총 필요금액
    
    if (total > wp) {
        throw new IllegalArgumentException("금액이 부족합니다.");
    }
    
    // 현재 코인 가격 보다 높은 금액으로 매수시 최저가로 매수됨
    if (price >= request.getCoin().getCoin_price()) {
      request.setPrice(request.getCoin().getCoin_price());
      price = request.getPrice();
      fee = feeCheck(price, cnt);
      request.setFee(fee);
      total = price*cnt+fee;
      
    } else {
      request.setType(3); // 예약으로 돌림
      request.setFee(fee);
    }
    
    logger.info("코인에 매수 진행 - member:{}, coin:{}, pay:{}, type:{}", request.getMember().getMember_no(), request.getCoin().getCoin_no(), request.getPrice(), request.getType());
    try {
      //거래에 데이터 삽입
      Deal deal = dealRepository.save(request.toEntity());
      
      //크레딧 서비스 호출 크레딧 또 빼고
      payService.buy(request.getMember(), total, deal);
      
      return deal;
    } catch (DataIntegrityViolationException e) {
      // 외래 키 오류 또는 기타 무결성 위반 처리
      logger.error("무결성 제약조건 위반 발생: {}", e.getMessage());
      throw new RuntimeException("회원 또는 코인 정보가 유효하지 않습니다.");
      
    } catch (Exception e) {
      // 그 외 일반적인 예외 처리
      logger.error("거래 처리 중 예외 발생: {}", e.getMessage());
      throw new RuntimeException("거래 처리 중 문제가 발생했습니다.");
      
    }
  }
  
  /** 매도 시 실행 */
  public Deal selldeal(DealDTO.DealSellPay request) {
    // 가지고 있는 코인 갯수
    int buycnt = getBuybyCnt(request.getMember().getMember_no(), request.getCoin().getCoin_no());
    int sellcnt = getSellbyCnt(request.getMember().getMember_no(), request.getCoin().getCoin_no());
    int ownedCnt = buycnt - sellcnt;
    if (ownedCnt <= 0) {
      throw new IllegalArgumentException("해당 코인을 가지고 있지 않습니다.");
    }
    
    System.out.println("가지고 있는 갯수: " + ownedCnt);
    System.out.println("멤버no: " +request.getMember().getMember_no());
    System.out.println("코인no: " +request.getCoin().getCoin_no());
    int price = request.getPrice();
    int cnt = request.getCnt();
    int fee = feeCheck(price, cnt);
    int total = price*cnt-fee; // 총 지급금액
        
    if (ownedCnt < cnt) {
      throw new IllegalArgumentException("가지고 있는 갯수 부족합니다.");
    }
    
    // 현재 코인 가격 보다 높은 금액으로 매수시 최저가로 매수됨
    if (price <= request.getCoin().getCoin_price()) {
      request.setPrice(request.getCoin().getCoin_price());
      price = request.getPrice();
      fee = feeCheck(price, cnt);
      request.setFee(fee);
      total = price*cnt-fee;
      
      //거래에 데이터 삽입
      Deal deal = dealRepository.save(request.toEntity());
      
      //크레딧 서비스 호출 크레딧 또 빼고
      payService.sell(request.getMember(), total, deal);
      
      logger.info("코인에 매도 진행 - member:{}, coin:{}, pay:{}, type:{}", request.getMember().getMember_no(), request.getCoin().getCoin_no(), request.getPrice(), request.getType());
      
      return deal;
    } else {
      request.setType(4); // 예약으로 돌림
      request.setFee(fee);
      
    }
    
    logger.info("코인에 매도 진행 - member:{}, coin:{}, pay:{}, type:{}", request.getMember().getMember_no(), request.getCoin().getCoin_no(), request.getPrice(), request.getType());
    
    //거래에 데이터 삽입
    Deal deal = dealRepository.save(request.toEntity());
    
    return deal;
  }
  
  /** 수수료 계산 */
  public int feeCheck(int price, int cnt) {
    int fee = (int)(price*cnt*0.0005);
    if (fee == 0) return 1;
    return fee;
  }
  
  /** 주문의 가격과 갯수 리스트 반환  */
  public List<DealDTO.OrderList> getOrderList(Long coin_no){
    List<Object[]> list = dealRepository.getOrderList(coin_no);
//    System.out.println("list -> " + list);
    
    List<DealDTO.OrderList> result = list.stream()
        .map(f -> new DealDTO.OrderList(
        ((Number) f[0]).intValue(), 
        ((Number) f[1]).intValue()
        ))
        .collect(Collectors.toList());
//    System.out.println("result -> " + result);
    return result;
  }
  
  /** 날짜 내림 차순+ 페이징, pageNumber: 0부터 시작 */
  public Page<Deal> find_deal_by_member(Long member_no, int pageNumber, int pageSize) {
    Pageable pageable = PageRequest.of(pageNumber, pageSize); // 페이징 객체 생성
    return dealRepository.findDealsByMember(member_no, pageable);
  }
  
  /** 날짜 내림 차순+ 페이징 */
  public Page<Deal> find_deal_by_member_search(Long member_no, String coin_name, int pageNumber, int pageSize) {
    // Pageable pageable = PageRequest.of(pageNumber, pageSize); // 페이징 객체 생성
    Pageable pageable = PageRequest.of(
        pageNumber,
        pageSize,
        Sort.by("deal_date").descending() // rdate 컬럼 내림 차순 정렬
    );
    
    return dealRepository .findDealsByMemberSearch(member_no, coin_name, pageable);
  }
}
