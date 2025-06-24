package dev.mvc.deal;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.mvc.coinlike.CoinlikeRepository;
import dev.mvc.member.Member;
import dev.mvc.pay.PayService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DealService {
  private final DealRepository dealRepository;
  private final PayService payService;
  
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
  
  /** 매수 시 실행 */
  public Deal dealPay(Member member, DealDTO.DealPay request) {
    //돈 서비스 getMemberPay 호출해서 비교하고
    int wp = payService.getMemberPay(member.getMember_no());
    int cnt = request.getCnt();
    int fee = (int)(wp*cnt*0.05);
    int total = wp*cnt+fee;
    
    if (total < request.getPrice()) {
        throw new IllegalArgumentException("금액이 부족합니다.");
    }
    System.out.printf("코인에 매수 진행 - member:{}, coin:{}, pay:{}", member.getMember_no(), request.getCoin().getCoin_no(), request.getPrice());
    
    //거래에 데이터 삽입
    Deal deal = dealRepository.save(request.toEntity());
    
    //크레딧 서비스 호출 크레딧 또 빼고
    payService.buy(member, request.getPrice(), deal);
    
    return deal;
  }
  
}
