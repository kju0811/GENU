package dev.mvc.coin;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.mvc.coinlog.Coinlog;
import dev.mvc.coinlog.CoinlogRepository;
import dev.mvc.deal.Deal;
import dev.mvc.deal.DealService;
import dev.mvc.fluctuation.Fluctuation;
import dev.mvc.fluctuation.FluctuationDTO;
import dev.mvc.fluctuation.FluctuationRepository;
import dev.mvc.fluctuation.FluctuationService;
import dev.mvc.news.News;
import dev.mvc.news.NewsRepository;
import dev.mvc.notice.Notice;
import dev.mvc.notice.NoticeService;
import dev.mvc.pay.Pay;
import dev.mvc.pay.PayService;
import dev.mvc.sms.SMS;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoinService {
  private final CoinRepository coinRepository;
  private final CoinlogRepository coinlogRepository;
//  private final FluctuationRepository fluctuationRepository;
  private final NewsRepository newsRepository;
  private final FluctuationService fluctuationService;
  private final DealService dealService;
  private final PayService payService;
  private final NoticeService noticeService;
  
  private static final Logger logger = LoggerFactory.getLogger(DealService.class);
  
  /** 날짜 저장을 위한 임시 코드 */
  SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
  String now = sdf.format(new Date());
  
  /** 변동성을 위한 랜덤 */
  private final Random rand = new Random();
  
  /** Create, INSERT~, UPDATE~ */
  public Coin save(Coin coin) {
    return coinRepository.save(coin); 
  }
  
  /** 시뮬레이션 로직 */
  public double calculateFluctuation(int buyVolume, int sellVolume, int newsSentiment) {
    // (1) 정규분포 기반 기본 변화율
    double stdDev = 15.0;
    double baseChange = rand.nextGaussian() * stdDev;
    
    // (2) 순매수량 보정
    int netBuy = buyVolume - sellVolume;
    
    // * 20  -> 20% 보정최대 / 클수록 영향이큼  (조정필요)
    // tanh(x) 크면 결과가 +-1에 거의 수렴 -> 0.01를 곱해
    // 현재 1당 0.02% 적용중
    double netBuyAdjustment = Math.tanh(netBuy * 0.001) * 20;
    
    // (3) 뉴스 감성 보정 (기사 분석 결과: 0 ~ 1) // 조정할수도?
    double newsAdjustment = newsSentiment * 5.0;
    
    // (4) 최종 변화율
    double change = baseChange + netBuyAdjustment + newsAdjustment;
    change = Math.max(-50, Math.min(50, change)); // -50% ~ +50% 제한

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
    for (Coin coin : coinRepository.findAll()) {
      int cnt = 0;
      List<FluctuationDTO> fluDTO = fluctuationService.findByRdatePeriod(coin.getCoin_no());
//      System.out.println("1번 : "+fluDTO);
      
      for (FluctuationDTO dto : fluDTO) {
//        News news = newsRepository.getReferenceById(dto.getNews().getNews_no());
        News news = newsRepository.getReferenceById(dto.getNews_no());  // << 레포지토리 -> 서비스로 교체해야함
//        News news = newsServic.
//        System.out.println("2번 news -> "+ news);
        
        if (news.getEmotion() == 1) {
          cnt++;
        } else if (news.getEmotion() == 0) {
          cnt--;
        }
      }
      
//      System.out.println("3번 cnt ->"+ cnt);
      
      // 해당 코인의 체결된 매수, 매도된 코인 개수(deal_cnt)로 변동 추가
      int buy_cnt = dealService.getTotalType1(coin.getCoin_no());
      int sell_cnt = dealService.getTotalType2(coin.getCoin_no());
//      System.out.println("buy_cnt -> "+buy_cnt);
//      System.out.println("sell_cnt -> "+sell_cnt);
      
      double fluctuation = calculateFluctuation(buy_cnt, sell_cnt, cnt); // 예시 값
      coin.setCoin_price((int)(coin.getCoin_price() * (1 + fluctuation / 100)));
      coin.setCoin_percentage(fluctuation);
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
  @Transactional
  @Scheduled(cron = "0 0/2 * * * *") // 매 10분마다
  public void scheduledUpdate() {
    System.out.println("전체 코인 변동 시작" + LocalDateTime.now());
    updateAllCoinPrices();
    System.out.println("전체 코인 변동 완료" + LocalDateTime.now());
    scheduledBuy();
    System.out.println("예약 매수 처리 완료" + LocalDateTime.now());
    scheduledSell();
    System.out.println("예약 매도 처리 완료" + LocalDateTime.now());
    noticeCheck();
    System.out.println("알림 처리 완료" + LocalDateTime.now());
  }
  
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
  
  /** 변동시 예약 매수 확인 */
  @Transactional
  public void scheduledBuy() {
    for (Coin coin : coinRepository.findAll()) {
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
    System.out.println("예약 매수 처리완료");
    }
  }
  
  /** 변동시 예약 매도 확인 */
  @Transactional
  public void scheduledSell() {
    for (Coin coin : coinRepository.findAll()) {
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
      System.out.println("예약 매도 처리완료");
    }
  }
  
  /** 변동시 알림 확인 */
  @Transactional
  public void noticeCheck() {
    for (Coin coin : coinRepository.findAll()) {
      List<Notice> noticeList = noticeService.getPending(coin.getCoin_no());
      if (!noticeList.isEmpty()) {
        for (Notice getn : noticeList) {
          String tel = getn.getMember().getMember_tel().replaceAll("-", "");
          String coin_name = coin.getCoin_name();
          String wp = String.valueOf(getn.getNotice_price());
          String msg = String.format("%s의 가격이 설정하신 %s누렁에 도달했습니다.", coin_name, wp);
          String[] args = {tel, msg};
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
            }
          }
        }
      }
    System.out.println("알림 처리 완료");
    }
  }
  

}
