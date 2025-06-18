package dev.mvc.pay;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.mvc.member.Member;


@Service
public class PayService {
  @Autowired
  PayRepository payRepository;
  
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
  
  /**
   * 돈을 지급하기 위한 메소드
   *
   * @param member
   * @param pay_pay
   */
  public void additional(Member member, int pay_pay) {
      Pay pay = Pay.builder()
              .member(member)
              .pay_pay(pay_pay)
              .pay_type(0)
              .build();
      //크레딧에 데이터 삽입
      payRepository.save(pay); //movieId, credit
      
      System.out.printf("[Credit] 크래딧 지급 - member:{}, pay_pay:{}", member.getMember_no(), pay_pay);
      // log.info("[Credit] 크래딧 지급 - user:{}, amount:{}", user.getEmail(), money);
  }

//  /**
//   * 크레딧을 환불을 위해 다시 지급 하기위한 메소드
//   *
//   * @param user
//   * @param money
//   * @param funding
//   */
//  public void refund(User user, int money, Funding funding) {
//      Credit credit = Credit.builder()
//              .user(user)
//              .amount(money)
//              .transactionType(3)
//              .funding(funding)
//              .build();
//      //크레딧에 데이터 삽입
//      creditRepository.save(credit); //movieId, credit
//      log.info("[Credit] 환불 크래딧 지급 - user:{}, amount:{}, fundingId:{}", user.getEmail(), money, funding.getId());
//  }
  
}
