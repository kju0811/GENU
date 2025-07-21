package dev.mvc.notice;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import dev.mvc.coin.Coin;
import dev.mvc.coin.CoinRepository;
import dev.mvc.pay.Pay;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeService {
  private final NoticeRepository noticeRepository;
  private final CoinRepository coinRepository;
  
  /** UPDATE */
  public void saveUpdate(Notice notice) {
    noticeRepository.save(notice); 
  }
  /** Create, INSERT~ */
  public Notice save(Notice notice) {
    Optional<Coin> optcoin = coinRepository.findById(notice.getCoin().getCoin_no()); // 프론트에서 coin_no만 넘김
    
    // 가격 중복 체크
    int checkPrice = noticeRepository.existsCheckPrice(notice.getNotice_price(), notice.getMember().getMember_no()) ;
//    System.out.println("checkPrice -> "+ checkPrice);
    if (checkPrice == 1) {
      throw new RuntimeException("해당 금액은 이미 알림된 금액입니다.");
    }
    
    if (optcoin.isPresent()) {
      Coin coin = optcoin.get();
      int wp = notice.getNotice_price();
      int cp = coin.getCoin_price();
  //    System.out.println("wp ->" +wp);
  //    System.out.println("cp ->" +cp);
      if (wp < cp) { // 원하는 값이 이상이면
        notice.setNotice_type(1);
        
      } else if (wp > cp) { // 원하는 값이 이하면
        notice.setNotice_type(0);
        
      } else {
        throw new RuntimeException("원하시는 금액과 현재가가 같습니다.");
      }
      Notice nt = noticeRepository.save(notice); 
      return nt;
    } else {
      throw new IllegalArgumentException("해당 코인을 찾을 수 없습니다.");
    }
  }
  
  /** 알림 id에 해당하는 정보 반환 */
  public Optional<Notice> find_by_id(Long id) {
    return noticeRepository.findById(id);  // method/SQL 자동 생성
  }
  
  /** 알림 id에 해당하는 알림 삭제 */
  public void deleteEntity(Long id) {
    noticeRepository.deleteById(id);
  }
  
  /** 모든 레코드 출력 */
  public List<Notice> find_all() {
    return noticeRepository.findAll();  // method/SQL 자동 생성
  }
  
  /** member_no에 해당 하는 알림 반환 */
  public List<Notice> getMemberNotice(Long member_no) {
    return noticeRepository.getMemberNotice(member_no);
  }
  
  /** member_no AND coin_no에 해당 하는 알림 반환 */
  public List<Notice> getMemberCoinNotice(Long member_no, Long coin_no) {
    return noticeRepository.getMemberCoinNotice(member_no, coin_no);
  }
  
  /** coin_no에 해당 하고 발송되는 않은 알림 반환 */
  public List<Notice> getPending(Long coin_no) {
    return noticeRepository.getPending(coin_no);
  }
  
}
