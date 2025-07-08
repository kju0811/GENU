package dev.mvc.coinlike;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoinlikeService {
  private final CoinlikeRepository coinlikeRepository;
  
  /** Create, INSERT~, UPDATE~ */
  public void save(Coinlike coinlike) {
    coinlikeRepository.save(coinlike); 
  }
  
  /** 코인좋아요 id에 해당하는 정보 반환 */
  public Optional<Coinlike> find_by_id(Long id) {
    return coinlikeRepository.findById(id);  // method/SQL 자동 생성
  }
  
  /** 코인좋아요 id에 해당하는 코인좋아요 삭제 */
  public void deleteEntity(Long id) {
    coinlikeRepository.deleteById(id);
  }
  
  /** 모든 레코드 출력 */
  public List<Coinlike> find_all() {
    return coinlikeRepository.findAll();  // method/SQL 자동 생성
  }
  
  /** 멤버가 좋아요를 누른 코인 출력 */
  public List<Coinlike> findByMemberCoinlike(Long member_no){
    return coinlikeRepository.findByMemberCoinlike(member_no);
  }
}
