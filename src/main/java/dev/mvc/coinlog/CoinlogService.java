package dev.mvc.coinlog;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.mvc.coin.Coin;
import dev.mvc.coinlike.CoinlikeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoinlogService {
  private final CoinlogRepository coinlogRepository;
  
  /** 코인기록 저장, Create, INSERT~, UPDATE~ */
  public void save(Coinlog coinlog) {
    coinlogRepository.save(coinlog); 
  }
  
  /** 코인기록 id에 해당하는 코인 삭제 */
  public void deleteEntity(Long id) {
    coinlogRepository.deleteById(id);
  }
  
  /** 코인기록 id에 해당하는 정보 반환 */
  public Optional<Coinlog> find_by_id(Long id) {
    return coinlogRepository.findById(id);  // method/SQL 자동 생성
  }
  
  /** 모든 레코드 출력 */
  public List<Coinlog> find_all() {
    return coinlogRepository.findAll();  // method/SQL 자동 생성
  }
  
}
