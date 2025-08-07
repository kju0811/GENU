package dev.mvc.pay;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.mvc.coinlike.CoinlikeRepository;
import dev.mvc.deal.Deal;
import dev.mvc.deal.DealDTO;
import dev.mvc.member.Member;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PayService {
  private final PayRepository payRepository;
  
  /** Create, INSERT~, UPDATE~ */
  public void save(Pay pay) {
    payRepository.save(pay); 
  }
  
  /** 모든 레코드 출력 */
  public List<Pay> find_all() {
    return payRepository.findAll();  // method/SQL 자동 생성
  }

  /** pay id에 해당하는 정보 반환 */
  public Optional<Pay> find_by_id(Long id) {
    return payRepository.findById(id);  // method/SQL 자동 생성
  }
  
  /** pay id에 해당하는 돈 삭제 */
  public void deleteEntity(Long id) {
    payRepository.deleteById(id);
  }
  
  /** member_no에 해당하는 pay */
  public int getMemberPay(Long member_no) {
    return payRepository.findTotalPayMember_no(member_no);
  }
  
  /**
   * 처음 돈을 지급하기 위한 메소드
   *
   * @param member
   * @param pay_pay
   */
  public void firstadditional(Member member, int pay_pay) {
      Pay pay = Pay.builder()
              .member(member)
              .pay_pay(pay_pay)
              .pay_type(0)
              .build();
      //크레딧에 데이터 삽입
      save(pay); //movieId, credit
      
      System.out.printf("[Credit] 크래딧 지급 - member:{}, pay_pay:{}", member.getMember_no(), pay_pay);
      // log.info("[Credit] 크래딧 지급 - user:{}, amount:{}", user.getEmail(), money);
  }
  
  /**
   * 매수로 차감하기 위한 메소드
   *
   * @param member
   * @param pay_pay
   * @param deal
   */
  public void buy(Member member, int pay_pay, Deal deal) {
    Pay pay = Pay.builder()
              .member(member)
              .pay_pay(-pay_pay)
              .pay_type(deal.getDeal_type()) // 매수 타입 받아서 그래도 적용
              .deal(deal)
              .build();
      //크레딧에 데이터 삽입
      save(pay); //movieId, credit
      // log.info("[Credit] 크래딧 차감 - user:{}, amount:{}, fundingId:{}", user.getEmail(), money, funding.getId());
  }
  
  /**
   * 매도로 지급하기 위한 메소드
   *
   * @param member
   * @param pay_pay
   * @param deal
   */
  public void sell(Member member, int pay_pay, Deal deal) {
      Pay pay = Pay.builder()
              .member(member)
              .pay_pay(pay_pay)
              .pay_type(deal.getDeal_type()) // 매도 타입 받아서 그대로 적용
              .deal(deal)
              .build();
      //크레딧에 데이터 삽입
      save(pay); //movieId, credit
      
      // System.out.printf("[Credit] 크래딧 지급 - member:{}, pay_pay:{}", member.getMember_no(), pay_pay);
      // log.info("[Credit] 크래딧 지급 - user:{}, amount:{}", user.getEmail(), money);
  }
  
  /** deal id에 해당하는 정보 반환 */
  public Pay getDeal_noPay(Long id) {
    return payRepository.getDeal_noPay(id);
  }
  
  /** 멤버의 자금 내역 */
  public List<Pay> get_member_pay_list(Long member_no) {
    return payRepository.get_member_pay_list(member_no);
  }
  
}
