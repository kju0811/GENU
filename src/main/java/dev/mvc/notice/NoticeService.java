package dev.mvc.notice;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import dev.mvc.coin.Coin;
import dev.mvc.coin.CoinRepository;
import dev.mvc.exception.DelistedCoinException;
import dev.mvc.pay.Pay;
import jakarta.persistence.EntityNotFoundException;
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
    // 코인 정보 조회 (프론트에서 coin_no만 전달됨)
    Coin coin = coinRepository.findById(notice.getCoin().getCoin_no())
        .orElseThrow(() -> new EntityNotFoundException("해당 코인을 찾을 수 없습니다."));
    
    if (coin.getCoin_type()==0) {
      throw new DelistedCoinException("해당 코인은 상장폐지되어 알림등록할 수 없습니다.");
    }
    
    // 가격 중복 체크
    int checkPrice = noticeRepository.existsCheckPrice(notice.getNotice_price(), notice.getMember().getMember_no()) ;
    
    if (checkPrice == 1) {
      throw new IllegalStateException("해당 금액은 이미 등록된 알림 금액입니다.");
    }
  
    int desiredPrice = notice.getNotice_price(); // 내가 알림 받았으면 하는 가격
    int currentPrice = coin.getCoin_price(); // 코인의 현재 가격
  
    if (desiredPrice < currentPrice) {
        notice.setNotice_type(1); // 이상 시 알림
    } else if (desiredPrice > currentPrice) {
        notice.setNotice_type(0); // 이하 시 알림
    } else {
        throw new IllegalArgumentException("원하시는 금액과 현재가가 동일합니다.");
    }
  
    notice.setCoin(coin); // 안전하게 연관관계 설정
    return noticeRepository.save(notice);

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
