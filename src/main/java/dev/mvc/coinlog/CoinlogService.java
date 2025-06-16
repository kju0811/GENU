package dev.mvc.coinlog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CoinlogService {
  @Autowired
  CoinlogRepository coinlogRepository;
  
  /** 코인기록 저장, Create, INSERT~, UPDATE~ */
  public void save(Coinlog coinlog) {
    coinlogRepository.save(coinlog); 
  }
  
  /** 코인기록 id에 해당하는 코인 삭제 */
  public void deleteEntity(Long id) {
    coinlogRepository.deleteById(id);
  }
  
  /** 모든 레코드 출력 */
  public List<Coinlog> find_all() {
    return coinlogRepository.findAll();  // method/SQL 자동 생성
  }
  
}
