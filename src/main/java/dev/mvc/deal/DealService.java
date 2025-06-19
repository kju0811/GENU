package dev.mvc.deal;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.mvc.coinlike.CoinlikeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DealService {
  private final DealRepository dealRepository;
  
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
  
}
