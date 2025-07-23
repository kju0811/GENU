package dev.mvc.coinlike;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
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
  public List<Coinlike> findByMemberCoinlikeList(Long member_no){
    return coinlikeRepository.findByMemberCoinlikeList(member_no);
  }
  
  /** 멤버가 해당 코인에 좋아요를 눌렀는지 확인하는 메서드  */
  public boolean isMemberCoinlike(Long member_no, Long coin_no){
    return coinlikeRepository.isMemberCoinlike(member_no, coin_no).isPresent();
  }
  
  /** 코인좋아요 삭제 */
  @Transactional
  public void deleteCoinlike(Long member_no, Long coin_no) {
    Coinlike coinlike = coinlikeRepository.isMemberCoinlike(member_no, coin_no)
    .orElseThrow(() -> new EntityNotFoundException("해당 정보는 존재하지 않는 정보입니다."));
    
    coinlikeRepository.delete(coinlike);
  }
}
