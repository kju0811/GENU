package dev.mvc.notice;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import dev.mvc.coin.Coin;
import dev.mvc.pay.Pay;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeService {
  private final NoticeRepository noticeRepository;
  
  /** UPDATE */
  public void saveUpdate(Notice notice) {
    noticeRepository.save(notice); 
  }
  /** Create, INSERT~ */
  public void save(Notice notice) {
    int wp = notice.getNotice_price();
    int cp = notice.getCoin().getCoin_price();
//    System.out.println("wp ->" +wp);
//    System.out.println("cp ->" +cp);
    if (wp < cp) {
//      System.out.println("원하는 값이 이상이되면.");
      notice.setNotice_type(1);
    } else if (wp > cp) {
//      System.out.println("원하는 값이 이하가되면.");
      notice.setNotice_type(0);
    } else {
      throw new RuntimeException("원하시는 금액과 현재가가 같습니다.");
    }
    noticeRepository.save(notice); 
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
  
  /** coin_no에 해당 하고 발송되는 않은 알림 반환 */
  public List<Notice> getPending(Long coin_no) {
    return noticeRepository.getPending(coin_no);
  }
  
}
