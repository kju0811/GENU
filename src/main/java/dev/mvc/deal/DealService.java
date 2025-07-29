package dev.mvc.deal;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.mvc.coin.Coin;
import dev.mvc.coin.CoinDTO;
import dev.mvc.coin.CoinRepository;
import dev.mvc.exception.DelistedCoinException;
import dev.mvc.pay.Pay;
import dev.mvc.pay.PayService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DealService {
  private final DealRepository dealRepository;
  private final PayService payService;
  private static final Logger logger = LoggerFactory.getLogger(DealService.class);
  private final CoinRepository coinRepository;
  
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
  
  /** 멤버가 가지고 있는 총 코인갯수 반환 */
  public int getTotalCnt(Long member_no, Long coin_no) {
    int buycnt = getBuybyCnt(member_no, coin_no);
    int sellcnt = getSellbyCnt(member_no, coin_no);
    int ownedCnt = buycnt - sellcnt;
    return ownedCnt;
  }
  
  /** 매수 체결된 코인갯수 반환 + 기간 하루 치*/
  public Integer getTotalType1(Long coin_no) {
    return dealRepository.getTotalType1(coin_no);
  }
  
  /** 매도 체결된 코인갯수 반환 + 기간 하루 치 */
  public Integer getTotalType2(Long coin_no) {
    return dealRepository.getTotalType2(coin_no);
  }
  
  /** 예약 매수된 정보 반환 */
  public List<Deal> getType3(Long coin_no) {
    return dealRepository.getType3(coin_no);
  }
  
  /** 예약 매수된 정보 반환 */
  public List<Deal> getType4(Long coin_no) {
    return dealRepository.getType4(coin_no);
  }
  
  /** 매수 시 실행 */
  @Transactional
  public Deal buydeal(DealDTO.DealBuyPay request) {
    // coin_no만 넘어와서 확인해야함
    int coinType = coinRepository.findCoinType(request.getCoin().getCoin_no())
        .orElseThrow(() -> new EntityNotFoundException("해당 코인이 존재하지 않습니다."));
    System.out.println("코인 타입 -> "+coinType);
    // 코인타입이 상장폐지이면
    if (coinType==0) {
      throw new DelistedCoinException("해당 코인은 상장폐지되어 거래할 수 없습니다.");
    }
    
    //돈 서비스 getMemberPay 호출해서 비교하고
    int wp = payService.getMemberPay(request.getMember().getMember_no()); // 보유 자산
    System.out.println("현자산: " + wp);
    System.out.println("멤버no: " +request.getMember().getMember_no());
    int price = request.getPrice();
    System.out.println("price -> "+ price);
    int cnt = request.getCnt();
    int fee = feeCheck(price, cnt);
    int total = price*cnt+fee; // 총 필요금액
    
    if (total > wp) {
        throw new IllegalArgumentException("금액이 부족합니다.");
    }

    Optional<Coin> optcoin = coinRepository.findById(request.getCoin().getCoin_no()); // 프론트에서 coin_no만 넘김
    if (optcoin.isPresent()) {
      Coin coin = optcoin.get();
      
      // 현재 코인 가격 보다 높은 금액으로 매수시 최저가로 매수됨
      if (price >= coin.getCoin_price()) {
        request.setPrice(coin.getCoin_price()); // 최저가
        price = request.getPrice();
        System.out.println("2번 price -> "+ price);
        fee = feeCheck(price, cnt);
        request.setFee(fee);
        total = price*cnt+fee;
        
      } else {
        request.setType(3); // 예약으로 돌림
        request.setFee(fee);
        
      }
    } else {
      throw new IllegalArgumentException("해당 코인을 찾을 수 없습니다.");
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
  @Transactional
  public Deal selldeal(DealDTO.DealSellPay request) {
    // coin_no만 넘어와서 확인해야함
    int coinType = coinRepository.findCoinType(request.getCoin().getCoin_no())
        .orElseThrow(() -> new EntityNotFoundException("해당 코인이 존재하지 않습니다."));
    System.out.println("코인 타입 -> "+coinType);
    // 코인타입이 상장폐지이면
    if (coinType==0) {
      throw new DelistedCoinException("해당 코인은 상장폐지되어 거래할 수 없습니다.");
    }
    
    // 가지고 있는 코인 갯수
    int ownedCnt = getTotalCnt(request.getMember().getMember_no(), request.getCoin().getCoin_no());
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

    Optional<Coin> optcoin = coinRepository.findById(request.getCoin().getCoin_no()); // 프론트에서 coin_no만 넘김
    if (optcoin.isPresent()) {
      Coin coin = optcoin.get();
      
   // 현재 코인 가격 보다 높은 금액으로 매수시 최저가로 매수됨
      if (price <= coin.getCoin_price()) { 
        request.setPrice(coin.getCoin_price());
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
    } else {
      throw new IllegalArgumentException("해당 코인을 찾을 수 없습니다.");
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
  
  /** 호가창 : 주문의 가격과 갯수 리스트 반환  */
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
  
  /** 매수 주문 취소시 실행 */
  @Transactional
  public void cancelBuyDeal(Long deal_no){
    // 거래테이블 주문 타입 변경
    Optional<Deal> deal = dealRepository.findById(deal_no);
    if (!deal.isEmpty()) {
      Deal data = deal.get();
      if (data.getDeal_type() != 3) {
        throw new IllegalArgumentException("매수 주문 타입이 아닙니다.");
      }

      data.setDeal_type(5);
      dealRepository.save(data);
    } else {
      throw new IllegalArgumentException("오류가 발생했습니다.");
    }
    // 돈테이블 환불 적용
    Pay pay = payService.getDeal_noPay(deal_no);
    pay.setPay_type(5);
    payService.save(pay);
  }
  
  /** 매도 주문 취소시 실행 */
  @Transactional
  public void cancelSellDeal(Long deal_no) {
    // 거래테이블 주문 타입 변경
    Optional<Deal> deal = dealRepository.findById(deal_no);
    if (!deal.isEmpty()) {
      Deal data = deal.get();
      if (data.getDeal_type() != 4) {
        throw new IllegalArgumentException("매도 주문 타입이 아닙니다.");
      }
      data.setDeal_type(6);
      dealRepository.save(data);
    } else {
        throw new IllegalArgumentException("오류가 발생했습니다.");
    }
  }
  
  /** 멤버가 해당 코인에 주문한 거래내역 날짜 내림차 순 반환 */
  public List<Deal> find_deal_by_member_coin(Long member_no, Long coin_no) {
    return dealRepository .findDealsByMemberCoin(member_no, coin_no);
  }
  
  /** 멤버가 해당 코인에 2주간 주문한 거래내역 날짜 내림차 순 반환 */
  public List<Deal> find_deal_by_member_coin_twoweek(Long member_no) {
    LocalDateTime twoWeeksAgo = LocalDateTime.now().minusWeeks(2);
    return dealRepository.findRecentDealsTwoweeks(member_no, twoWeeksAgo);
  }
  
  /** 평단가 반환, 가격, 갯수 반환*/
  public List<Integer> getAVGprice(Long member_no, Long coin_no) {
    // Oracle이 처리할 수 있는 안전한 최소 날짜
    LocalDateTime safeMinDate = LocalDateTime.of(1900, 1, 1, 0, 0);
    
    // 보유 수량이 0이 된 마지막 시점의 날짜을 받아옴
    LocalDateTime lastZeroDate = Optional.ofNullable(dealRepository.findLastZeroQuantityDate(member_no, coin_no))
        .orElse(safeMinDate);
    
//    System.out.println("lastZeroDate -> "+ lastZeroDate);
    // 기간 이후의 평단가를 위해 가격과 갯수 반환
    List<Object[]> getList = dealRepository.getAVGprice(member_no, coin_no, lastZeroDate);
    
    int totalPrice = 0;
    int totalCnt = 0;
    
    // 갯수
    int bc = dealRepository.getBuybyCnt(member_no, coin_no);
    int sc = dealRepository.getSellbyCntOk(member_no, coin_no);
    
    // 평단가 계산
    for (Object[] arr : getList) {
      int p = ((Number) arr[0]).intValue();
      int k = ((Number) arr[1]).intValue();

      totalPrice += p*k; // 총합 계산
      totalCnt += k; // 계산을 위한 갯수
    }
    
    List<Integer> list = new ArrayList<>();
    if (totalCnt == 0) return list;
    list.add(totalPrice / totalCnt);
    list.add(bc - sc);
    
    return list;
  }
  
  /** 멤버가 가지고 있는 자산내역 */
  public List<DealDTO.MyAssetList> get_member_asset(Long member_no) {
      List<CoinDTO> coinList = coinRepository.getCoinList();
      List<DealDTO.MyAssetList> myAssetList = new ArrayList<>();
      
      for (CoinDTO dto : coinList) {
        List<Integer> getList = getAVGprice(member_no, dto.getCoin_no()); // 평단가, 가지고 있는 갯수
        
        if (getList == null || getList.size() < 2 ) continue; // 정보 없음

        int avgPrice = getList.get(0);
        int totalCnt = getList.get(1); // 가지고 있는 갯수
        if (totalCnt == 0) continue; // 자산 없음
        
        int currentTotalPrice = dto.getCoin_price() * totalCnt; // 현재 총 금액
        int previousTotalPrice = avgPrice * totalCnt; // 이전 총 금액
        
        // 이득, 퍼센트
        int profitAmount = currentTotalPrice - previousTotalPrice;
        double profitPercentage = 0.0;
        if (previousTotalPrice != 0) {
          profitPercentage = ((double) profitAmount / previousTotalPrice) * 100;
          profitPercentage = Math.round(profitPercentage * 10) / 10.0;
        }

        myAssetList.add(new DealDTO.MyAssetList(
            dto.getCoin_no(), 
            dto.getCoin_name(),
            dto.getCoin_img(), 
            totalCnt, 
            currentTotalPrice, 
            profitAmount, 
            profitPercentage,
            previousTotalPrice
            ));
      }
//      System.out.println("myAssetList ->"+ myAssetList);
      return myAssetList;
  }
  
  /** 단일 자산내역 반환 */
  public DealDTO.AssetInfo one_asset(Long member_no, Long coin_no) {
    
    Coin coin = coinRepository.findById(coin_no)
        .orElseThrow(() -> new EntityNotFoundException("해당 코인 정보를 찾을 수 없습니다."));
    
    List<Integer> getList = getAVGprice(member_no, coin_no); // 평단가, 갯수
    int avgPrice = getList.get(0);
    int totalCnt = getList.get(1);
    
    int currentPrice = coinRepository.getCoinPrice(coin_no); // 현재가
    int totalPrice = currentPrice * totalCnt; // 현재 평가 금액
    int previousTotalPrice = avgPrice * totalCnt; // 이전 총 금액
    
    // 이득, 퍼센트
    int profitAmount = totalPrice - previousTotalPrice ;
    double profitPercentage = 0.0;
    if (previousTotalPrice != 0) {
      profitPercentage = ((double) profitAmount / previousTotalPrice) * 100;
      profitPercentage = Math.round(profitPercentage * 10) / 10.0;
    }
    
    return new DealDTO.AssetInfo(
        coin.getCoin_no(),
        coin.getCoin_name(),
        coin.getCoin_img(),
        coin.getCoin_price(),
        coin.getCoin_percentage(),
        avgPrice,
        totalPrice,
        previousTotalPrice,
        profitAmount,
        profitPercentage,
        totalCnt,
        currentPrice
    );
  }
  
  // 체결강도 + 순매수량 반환
  public Map<String, Object> getStrengthAndNetBuy(Long coin_no) {
    int buy = getTotalType1(coin_no);
    int sell = getTotalType2(coin_no);
    int netBuy = buy - sell;

    double strength = 0.0;
    if (buy + sell != 0) {
        strength = ((double) buy / (buy + sell)) * 100.0;
        strength = Math.round(strength * 10.0) / 10.0; // 소수점 1자리 반올림
    }

    Map<String, Object> result = new LinkedHashMap<>();
    result.put("buy", buy);
    result.put("sell", sell);
    result.put("netBuy", netBuy);
    result.put("strength", strength);

    return result;
}
  
  // 체결된 목록
  public List<Deal> find_confirmed_deal_by_member_coin(Long member_no, Long coin_no) {
    return dealRepository.findConfirmedDealsByMemberCoin(member_no, coin_no);
  }

  
}
