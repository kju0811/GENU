package dev.mvc.coin;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.mvc.coinlog.Coinlog;
import dev.mvc.coinlog.CoinlogRepository;
import dev.mvc.deal.Deal;
import dev.mvc.deal.DealDTO;
import dev.mvc.deal.DealService;
import dev.mvc.exception.NotFoundException;
import dev.mvc.fluctuation.FluctuationDTO;
import dev.mvc.fluctuation.FluctuationService;
import dev.mvc.news.News;
import dev.mvc.news.NewsRepository;
import dev.mvc.notice.Notice;
import dev.mvc.notice.NoticeService;
import dev.mvc.notification.NotificationDTO;
import dev.mvc.notification.NotificationService;
import dev.mvc.pay.Pay;
import dev.mvc.pay.PayService;
import dev.mvc.sms.SMS;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoinService {
  private final CoinRepository coinRepository;
  private final CoinlogRepository coinlogRepository;
  private final NewsRepository newsRepository;
  private final FluctuationService fluctuationService;
  private final DealService dealService;
  private final PayService payService;
  private final NoticeService noticeService;
  private final NotificationService notificationService;
  
  private static final Logger logger = LoggerFactory.getLogger(DealService.class);
  
  /** 날짜 저장을 위한 임시 코드 */
  SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
  String now = sdf.format(new Date());
  
  /** 변동성을 위한 랜덤 */
  private final Random rand = new Random();
  
  /** Create, INSERT~, UPDATE~ */
  public Coin save(Coin coin) {  
    boolean isNew = (coin.getCoin_no() == null);
    
    Coin savecoin =  coinRepository.save(coin); 
    
    if (isNew) { // 새로운 코인시 기록에 추가
      Coinlog coinlog = new Coinlog();
      coinlog.setCoinlog_price(savecoin.getCoin_price());
      coinlog.setCoinlog_percentage(0.00);
      coinlog.setCoinlog_time(LocalDateTime.now());
      coinlog.setCoin(savecoin);
      coinlogRepository.save(coinlog);
    }
    
    return savecoin;
  }
    
  /** 시뮬레이션 로직 */
  public double calculateFluctuation(int buyVolume, int sellVolume, int newsSentiment) {
    // (1) 정규분포 기반 기본 변화율
    double stdDev = 8.0;
    double baseChange = rand.nextGaussian() * stdDev;
    
    // (2) 순매수량 보정
    int netBuy = buyVolume - sellVolume;
    
    // 3% 보정최대 / 클수록 영향이큼
    // tanh(x) 크면 결과가 +-1에 거의 수렴 -> 0.001를 곱해
    double netBuyAdjustment = Math.tanh(netBuy * 0.001) * 3;

    // (3) 뉴스 감성 보정 (기사 분석 결과: 0 ~ 1) -+0.3 -> 하루 -+43.2퍼
    double newsAdjustment = newsSentiment * 0.3;
    
    // (4) 최종 변화율
    double change = baseChange + netBuyAdjustment + newsAdjustment;
    change = Math.max(-30, Math.min(30, change)); // -30% ~ +30% 제한

    // 출력 로그
    System.out.printf(
        "기본: %.2f%%, 순매수 보정: %.2f%%, 뉴스 보정: %.2f%% → 최종 변화율: %.2f%%\n",
        baseChange, netBuyAdjustment, newsAdjustment, change
    );

    return change;
  }
  
  /** (선택) 전체 코인 가격을 주기적으로 업데이트하는 메서드 */
  @Transactional
  public void updateAllCoinPrices() {
    // 전체 코인을 조회해서 가격 업데이트
    for (Coin coin : coinRepository.findAllbytype1()) { // 타입이 1인 (진행중인 코인만)
      int cnt = 0;
      List<FluctuationDTO> fluDTO = fluctuationService.findByRdatePeriod(coin.getCoin_no());
      
      for (FluctuationDTO dto : fluDTO) {
        News news = newsRepository.getReferenceById(dto.getNews_no());
        
        if (news.getEmotion() == 1) {
          cnt++;
        } else if (news.getEmotion() == 0) {
          cnt--;
        }
      }
      
      // 해당 코인의 체결된 매수, 매도된 코인 개수(deal_cnt)로 변동 추가
      int buy_cnt = dealService.getTotalType1(coin.getCoin_no());
      int sell_cnt = dealService.getTotalType2(coin.getCoin_no());
      
      System.out.print(coin.getCoin_no()+"번 코인 -> ");
      double fluctuation = calculateFluctuation(buy_cnt, sell_cnt, cnt);
      int updatePrice = (int)(coin.getCoin_price() * (1 + fluctuation / 100));
      coin.setCoin_price(updatePrice);
      
      // 코인의 변동은 오늘시작가->현재가 의 변동률이다
      double ChangefromOpen = findFirstPriceToday(coin.getCoin_no(), updatePrice);
      coin.setCoin_percentage(ChangefromOpen);
      
      if (coin.getCoin_price() <= 50) { // 50누렁 이하면 상장폐지
        coin.setCoin_type(0);
        coin.setCoin_percentage(0.00); // 보기 불편해서 초기화
      }
      coinRepository.save(coin);
      
      Coinlog coinlog = new Coinlog();
      coinlog.setCoinlog_price(coin.getCoin_price());
      coinlog.setCoinlog_percentage(fluctuation);
      coinlog.setCoinlog_time(LocalDateTime.now());
      coinlog.setCoin(coin);
      coinlogRepository.save(coinlog);
    }
    
  }
  
  /**  작업중엔 정지하고 베포 -> 동시에 켜져있으면 같이 실행되서 큰일남 */
//  @Transactional
//  @Scheduled(cron = "0 0/2 * * * *") // 매 10분마다
//  public void scheduledUpdate() {
//    System.out.println("전체 코인 변동 시작" + LocalDateTime.now());
//    updateAllCoinPrices();
//    System.out.println("전체 코인 변동 완료" + LocalDateTime.now());
//    scheduledBuy();
//    System.out.println("예약 매수 처리 완료" + LocalDateTime.now());
//    scheduledSell();
//    System.out.println("예약 매도 처리 완료" + LocalDateTime.now());
//    noticeCheck();
//    System.out.println("알림 처리 완료" + LocalDateTime.now());
//  }
  
  /** 코인 id에 해당하는 정보 반환 */
  public Optional<Coin> find_by_id(Long id) {
    return coinRepository.findById(id);  // method/SQL 자동 생성
  }
  
  /** 코인 id에 해당하는 코인 삭제 */
  public void deleteEntity(Long id) {
    coinRepository.deleteById(id);
  }
  
  /** 모든 레코드 출력 */
  public List<Coin> find_all() {
    return coinRepository.findAll();  // method/SQL 자동 생성
  }
  
  /** 진행중인 코인가격 내림차순 레코드 출력 */
  public List<Coin> findbytype1PriceD() {
    return coinRepository.findbytype1PriceD();
  }
  
  /** 진행중인 코인 등락률 내림차순 레코드 출력 */
  public List<Coin> findbytype1PercentageD() {
    return coinRepository.findbytype1PercentageD();
  }
  
  /** 변동시 예약 매수 확인 */
  @Transactional
  public void scheduledBuy() {
    for (Coin coin : coinRepository.findAllbytype1()) { // 진행중인 코인만 
      List<Deal> dealList = dealService.getType3(coin.getCoin_no());
      if (!dealList.isEmpty()) {
        for (Deal getd : dealList) {
          Pay getp = payService.getDeal_noPay(getd.getDeal_no());
          
          // 예약금액 >= 변동된 현재가 else 유지
          if (getd.getDeal_price() >= coin.getCoin_price()) {
            getd.setDeal_type(1);
            getp.setPay_type(1);
            dealService.save(getd);
            payService.save(getp);
          }
        }
      }
    }
  }
  
  /** 변동시 예약 매도 확인 */
  @Transactional
  public void scheduledSell() {
    for (Coin coin : coinRepository.findAllbytype1()) { // 진행중인 코인만
      List<Deal> dealList = dealService.getType4(coin.getCoin_no());
      
      if (!dealList.isEmpty()) {
        for (Deal getd : dealList) {
          // 예약금액 >= 변동된 현재가 else 유지
          if (getd.getDeal_price() <= coin.getCoin_price()) {
            getd.setDeal_type(2);
            dealService.save(getd);
            int price = getd.getDeal_price();
            int cnt = getd.getDeal_cnt();
            int fee = dealService.feeCheck(price, cnt);
            int total = price*cnt-fee; // 총 필요금액
            payService.sell(getd.getMember(), total, getd);
          }
        }
      }
    }
  }
  
  /** 변동시 알림 확인 */
  @Transactional
  public void noticeCheck() {
    for (Coin coin : coinRepository.findAllbytype1()) { // 진행중인 코인만
      List<Notice> noticeList = noticeService.getPending(coin.getCoin_no());
      if (!noticeList.isEmpty()) {
        for (Notice getn : noticeList) {
          String tel = getn.getMember().getMember_tel().replaceAll("-", "");
          String coin_name = coin.getCoin_name();
          
          // 천 단위 콤마 추가
          int price = getn.getNotice_price();
          String wp = String.format("%,d", price);
//          String wp = String.valueOf(getn.getNotice_price()); 
          
          String msg = String.format("%s의 가격이 설정하신 %s누렁에 도달했습니다.", coin_name, wp);
          String[] args = {tel, msg};
          
          // 종합알림 컬럼 생성
          NotificationDTO notificationDTO = new NotificationDTO(); // DTO 생성
          notificationDTO.setNotification_text(msg);
          notificationDTO.setNotification_nametype("금액알림");
          notificationDTO.setNotification_targetno(coin.getCoin_no());
          notificationDTO.setMember(getn.getMember());
          
          if (getn.getNotice_type() == 1) { // 알림 금액이 변동된 현재가 보다 상승해야함
            if(getn.getNotice_price() >= coin.getCoin_price()) { // 알림 보내기
              try {
                SMS.main(args);  // IOException 처리
              } catch (IOException e) {
                logger.error("알림 처리 중 예외 발생: {}", e.getMessage());
                throw new RuntimeException("알림 처리 중 문제가 발생했습니다.");
              }
              getn.setNotice_status(1); // SMS 완료
              noticeService.saveUpdate(getn);
              notificationService.notificationCreate(notificationDTO);
            }
          } else if (getn.getNotice_type() == 0) { // 알림 금액이 변동된 현재가 보다 하락해야함
            if(getn.getNotice_price() <= coin.getCoin_price()) { // 알림 보내기
              try {
                SMS.main(args);  // IOException 처리
              } catch (IOException e) {
                logger.error("알림 처리 중 예외 발생: {}", e.getMessage());
                throw new RuntimeException("알림 처리 중 문제가 발생했습니다.");
              }
              getn.setNotice_status(1); // SMS 완료
              noticeService.saveUpdate(getn);
              notificationService.notificationCreate(notificationDTO);
            }
          }
        }
      }
    }
  }
  
  /**
   * 틱 사이즈 규칙
   * @param price
   * @return
   */
  public int getTickSize (int price) {
    if (100 <= price && price < 1000) return 1;
    if (1000 <= price && price < 10000) return 10;
    if (10000 <= price && price < 100000) return 100;
    if (100000 <= price && price < 1000000) return 500;
    if (1000000 <= price && price < 10000000) return 1000;
    if (10000000 <= price) return 5000;
    return 0;
  }
  
  /** 현재가보다 낮은 유효 주문 */
  public int handleLowerOrder(int price, int cp, int ts) {
    int max_range = 8;
    for (int i = 0; i<=max_range; i++) {
      if (cp - ts * (i+1) <= price && price < cp - (ts * i)) {
        return cp - ts * (i+1);
      }
    }
    return 0;
  }
  
  /** 현재가보다 높은 유효 주문 */
  public int handleUpperOrder(int price, int cp, int ts) {
    int max_range = 8;
    for (int i = 0; i<=max_range; i++) {
      if (cp + ts * i < price && price <= cp + ts * (i + 1)) {
        return cp + ts * (i + 1);
      }
    }
    return 0;
  }

  /**
   * 호가창 서비스
   * @param coin_no
   * @return
   */
  public Map<Integer, Integer> TickList (Long coin_no) {
    Coin coin = coinRepository.findById(coin_no).orElseThrow(() -> new NotFoundException("코인 없음"));
    
    int cp = coin.getCoin_price(); // 현재가 기준 
    int ts = getTickSize(cp); // 틱 간격
    
    int rangeCnt = 10; // 위아래 10개
    int minp = cp - ts * rangeCnt;
    int maxp = cp + ts * rangeCnt;
    int cnt = 0;

    Map<Integer, Integer> data = new LinkedHashMap<>(); // LinkedHashMap 넣은 순서대로
    while (minp <= maxp) { // 미리 초기값 세팅
      data.put(minp, cnt);
      minp += ts;
    }
//    System.out.println("기본 data 값 -> " + data);
    
    List<DealDTO.OrderList> olist = dealService.getOrderList(coin_no);
//    System.out.println("olist 값 -> " + olist);
    
    minp = cp - ts * rangeCnt; // 값 초기화
    for (DealDTO.OrderList ol : olist) {
      int price = ol.getDeal_price();
      int ol_cnt = ol.getTotal_cnt();
      int bucketPrice = 0;

      if (price < minp + ts) { // 호가창 최저가 이하
        int pv = data.get(minp);
        data.put(minp, pv + ol_cnt); // 키가 최저가인 값에 이전값+ol_cnt 
        
      } else if (minp + ts <= price && price < cp) { // 밑에 주문 값 계산
        bucketPrice = handleLowerOrder(price, cp, ts);
        int pv = data.get(bucketPrice);
        data.put(bucketPrice, pv + ol_cnt);
        
      } else if (cp < price && price <= maxp - ts) { // 위에 주문 값 계산   
        bucketPrice = handleUpperOrder(price, cp, ts);
        int pv = data.get(bucketPrice);
        data.put(bucketPrice, pv + ol_cnt);
        
      } else if (maxp - ts < price) { // 위에 주문 최대 오버값 계산
        int pv = data.get(maxp);
        data.put(maxp, pv + ol_cnt); // 키가 최고가인 값에 이전값+ol_cnt 
      }
    }
//    System.out.println("수정후 data 값 -> " + data);
    return data;
  }

  /** 이름 or 정보로 검색 */
  public List<Coin> find_by_name_or_info(String keyword) {
    return coinRepository.searchCoinNameOrInfo(keyword);  // SQL 자동 생성
  }
  
  /** 코인 변동률 표기를 위한 메서드 */
  public double findFirstPriceToday(Long coin_no, Integer cp) {
    // 오늘자 첫번째 가격
    int openPrice = coinlogRepository.findFirstPriceToday(coin_no).orElse(0);
    if (openPrice == 0) {
      return 0.00;
    }
    
    // 처음가 -> 현재가 : 변동률 계산: ((현재가 - 시가) / 시가) * 100
    double changeRate = ((double)(cp - openPrice) / openPrice) * 100;
    
    // 소수점 둘째자리까지 반올림
    return Math.round(changeRate * 100.0) / 100.0;
  }
  
}
